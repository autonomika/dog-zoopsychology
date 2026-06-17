import { SITE_NAME, siteUrl } from "@/lib/site";

type SendResult = { ok: true } | { ok: false; error: string };

function mailFrom() {
  return process.env.MAIL_FROM?.trim() || `${SITE_NAME} <onboarding@resend.dev>`;
}

async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("\n[mail:dev] — RESEND_API_KEY не задан, письмо в консоль:\n");
      console.info(`  To: ${input.to}`);
      console.info(`  Subject: ${input.subject}`);
      console.info(`  ${input.text}\n`);
      return { ok: true };
    }
    return { ok: false, error: "Почта не настроена" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[mail]", res.status, body);
    return { ok: false, error: "Не удалось отправить письмо" };
  }

  return { ok: true };
}

export async function sendRegistrationCredentials(input: {
  to: string;
  name: string;
  password: string;
}): Promise<SendResult> {
  const loginUrl = `${siteUrl()}/login`;
  const subject = `Ваш пароль для входа — ${SITE_NAME}`;

  const text = [
    `Здравствуйте, ${input.name}!`,
    "",
    `Вы зарегистрировались на ${SITE_NAME}.`,
    "",
    `Email: ${input.to}`,
    `Пароль: ${input.password}`,
    "",
    `Войти: ${loginUrl}`,
    "",
    "Сохраните это письмо — если забудете пароль, используйте «Забыли пароль?» на странице входа.",
  ].join("\n");

  const html = `
    <p>Здравствуйте, <strong>${escapeHtml(input.name)}</strong>!</p>
    <p>Вы зарегистрировались на <strong>${escapeHtml(SITE_NAME)}</strong>.</p>
    <p><strong>Email:</strong> ${escapeHtml(input.to)}<br>
    <strong>Пароль:</strong> ${escapeHtml(input.password)}</p>
    <p><a href="${loginUrl}">Войти в аккаунт</a></p>
    <p style="color:#666;font-size:13px">Сохраните это письмо. Если забудете пароль — на странице входа есть «Забыли пароль?».</p>
  `;

  return sendEmail({ to: input.to, subject, html, text });
}

export async function sendPasswordResetLink(input: {
  to: string;
  name: string;
  token: string;
}): Promise<SendResult> {
  const resetUrl = `${siteUrl()}/reset-password?token=${encodeURIComponent(input.token)}`;
  const subject = `Сброс пароля — ${SITE_NAME}`;

  const text = [
    `Здравствуйте, ${input.name}!`,
    "",
    "Вы запросили сброс пароля. Перейдите по ссылке (действует 1 час):",
    resetUrl,
    "",
    "Если вы не запрашивали сброс — просто проигнорируйте это письмо.",
  ].join("\n");

  const html = `
    <p>Здравствуйте, <strong>${escapeHtml(input.name)}</strong>!</p>
    <p>Вы запросили сброс пароля. <a href="${resetUrl}">Задать новый пароль</a> (ссылка действует 1 час).</p>
    <p style="color:#666;font-size:13px">Если вы не запрашивали сброс — проигнорируйте это письмо.</p>
  `;

  return sendEmail({ to: input.to, subject, html, text });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim()) || process.env.NODE_ENV === "development";
}
