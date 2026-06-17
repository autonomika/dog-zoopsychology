export const DEFAULT_SITE_URL = "https://dog-zoopsychology.vercel.app";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "") || DEFAULT_SITE_URL;
}

export const SITE_NAME = "Дрессировка и поведение собак";
export const SITE_TAGLINE =
  "EdTech-платформа: дрессировка и поведение собак — тест, обучение по модулям и оплата через ЮKassa";

export const PORTFOLIO_AUTHOR =
  process.env.NEXT_PUBLIC_PORTFOLIO_AUTHOR?.trim() || "Autonomika";
export const PORTFOLIO_YEAR = "2025";

/** Аккуратные demo-реквизиты, если LEGAL_* не заданы (портфолио). */
export const PORTFOLIO_SELLER_NAME = `${PORTFOLIO_AUTHOR} Studio · portfolio demo`;
export const PORTFOLIO_SELLER_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "hello@autonomika.dev";
