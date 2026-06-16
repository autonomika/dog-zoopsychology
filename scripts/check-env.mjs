#!/usr/bin/env node
/**
 * Проверка переменных перед деплоем: node scripts/check-env.mjs
 */

const required = [
  "DATABASE_URL",
  "SESSION_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "YOOKASSA_SHOP_ID",
  "YOOKASSA_SECRET_KEY",
];

const recommended = ["COURSE_PRICE", "NEXT_PUBLIC_COURSE_PRICE"];

let ok = true;

console.log("\n🔍 Проверка окружения\n");

for (const key of required) {
  const val = process.env[key];
  const missing = !val || val.includes("change-me") || val.includes("...");
  if (missing) {
    console.log(`  ✗ ${key} — не задан или placeholder`);
    ok = false;
  } else {
    console.log(`  ✓ ${key}`);
  }
}

for (const key of recommended) {
  if (!process.env[key]) console.log(`  ⚠ ${key} — не задан (будет 1990)`);
}

const coursePrice = process.env.COURSE_PRICE?.trim();
const publicPrice = process.env.NEXT_PUBLIC_COURSE_PRICE?.trim();
if (coursePrice && publicPrice && coursePrice !== publicPrice) {
  console.log("  ✗ COURSE_PRICE и NEXT_PUBLIC_COURSE_PRICE должны совпадать");
  ok = false;
}

if (process.env.DATABASE_URL?.startsWith("file:")) {
  console.log("  ✗ DATABASE_URL — SQLite не подходит для Vercel, нужен postgresql://");
  ok = false;
}

if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 16) {
  console.log("  ✗ SESSION_SECRET — минимум 16 символов");
  ok = false;
}

console.log(ok ? "\n✅ Готово к деплою\n" : "\n❌ Заполните переменные (см. .env.example)\n");
process.exit(ok ? 0 : 1);
