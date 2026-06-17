import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  AUTH_REGISTER_FAILED,
  normalizeEmail,
  validatePassword,
} from "@/lib/auth-validation";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

function pickUtm(body: Record<string, unknown>) {
  const str = (key: string) => {
    const value = body[key];
    return typeof value === "string" && value.trim() ? value.trim().slice(0, 120) : undefined;
  };
  return {
    utmSource: str("utm_source"),
    utmMedium: str("utm_medium"),
    utmCampaign: str("utm_campaign"),
    utmContent: str("utm_content"),
    utmTerm: str("utm_term"),
  };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;
  const normalizedEmail = normalizeEmail(email);
  const passwordError = validatePassword(password);
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (!normalizedEmail || passwordError || !trimmedName) {
    return NextResponse.json({ error: AUTH_REGISTER_FAILED }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (exists) {
    return NextResponse.json({ error: AUTH_REGISTER_FAILED }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: normalizedEmail, password: hash, name: trimmedName, ...pickUtm(body) },
  });

  await createSession({ id: user.id, email: user.email, name: user.name });
  return NextResponse.json({ ok: true });
}
