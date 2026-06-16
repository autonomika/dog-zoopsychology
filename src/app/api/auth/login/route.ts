import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  AUTH_INVALID_CREDENTIALS,
  normalizeEmail,
  validatePassword,
} from "@/lib/auth-validation";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const normalizedEmail = normalizeEmail(email);
  const passwordError = validatePassword(password);

  if (!normalizedEmail || passwordError) {
    return NextResponse.json({ error: AUTH_INVALID_CREDENTIALS }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: AUTH_INVALID_CREDENTIALS }, { status: 401 });
  }

  await createSession({ id: user.id, email: user.email, name: user.name });
  return NextResponse.json({ ok: true });
}
