import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { validatePassword } from "@/lib/auth-validation";
import { prisma } from "@/lib/db";
import { verifyPasswordResetToken } from "@/lib/password-reset";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  const passwordError = validatePassword(password);

  if (typeof token !== "string" || !token.trim() || passwordError) {
    return NextResponse.json(
      { error: "Некорректная ссылка или пароль слишком короткий" },
      { status: 400 }
    );
  }

  const userId = await verifyPasswordResetToken(token.trim());
  if (!userId) {
    return NextResponse.json({ error: "Ссылка устарела или недействительна" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Ссылка устарела или недействительна" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hash } });

  return NextResponse.json({ ok: true });
}
