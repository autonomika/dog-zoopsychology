import { NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/auth-validation";
import { prisma } from "@/lib/db";
import { sendPasswordResetLink } from "@/lib/mail";
import { createPasswordResetToken } from "@/lib/password-reset";

const GENERIC_OK =
  "Если аккаунт с таким email есть, мы отправили ссылку для сброса пароля.";

export async function POST(req: Request) {
  const { email } = await req.json();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return NextResponse.json({ error: "Укажите корректный email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (user) {
    const token = await createPasswordResetToken(user.id);
    const result = await sendPasswordResetLink({
      to: user.email,
      name: user.name,
      token,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }
  }

  return NextResponse.json({ ok: true, message: GENERIC_OK });
}
