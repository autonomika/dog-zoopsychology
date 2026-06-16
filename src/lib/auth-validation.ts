export const AUTH_INVALID_CREDENTIALS = "Неверный email или пароль";
export const AUTH_REGISTER_FAILED =
  "Не удалось зарегистрироваться. Проверьте данные или войдите, если аккаунт уже есть.";

export const MIN_PASSWORD_LENGTH = 8;

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) return null;
  return normalized;
}

export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return `Пароль минимум ${MIN_PASSWORD_LENGTH} символов`;
  }
  return null;
}
