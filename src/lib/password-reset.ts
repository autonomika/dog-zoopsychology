import { SignJWT, jwtVerify } from "jose";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("Укажите SESSION_SECRET в .env (минимум 16 символов)");
  }
  return new TextEncoder().encode(s);
}

export async function createPasswordResetToken(userId: string) {
  return new SignJWT({ purpose: "password-reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setExpirationTime("1h")
    .sign(secret());
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.purpose !== "password-reset" || typeof payload.sub !== "string") {
      return null;
    }
    return payload.sub;
  } catch {
    return null;
  }
}
