#!/usr/bin/env node
/**
 * Проверка ключей ЮKassa: node scripts/test-yookassa.mjs
 * Нужны YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в .env или окружении
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const shopId = process.env.YOOKASSA_SHOP_ID?.trim();
const secretKey = process.env.YOOKASSA_SECRET_KEY?.trim();

if (!shopId || !secretKey) {
  console.error("\n❌ Задайте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в .env\n");
  process.exit(1);
}

const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
const amount = process.env.COURSE_PRICE || process.env.NEXT_PUBLIC_COURSE_PRICE || "1990";

console.log("\n🔐 Проверка ЮKassa...\n");
console.log(`  shopId: ${shopId}`);

const res = await fetch("https://api.yookassa.ru/v3/payments", {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    "Idempotence-Key": randomUUID(),
  },
  body: JSON.stringify({
    amount: { value: Number(amount).toFixed(2), currency: "RUB" },
    capture: true,
    confirmation: { type: "redirect", return_url: "https://example.com/return" },
    description: "Тест подключения — Зоопсихология",
    metadata: { test: "connection-check" },
  }),
});

const data = await res.json();

if (!res.ok) {
  console.error(`\n❌ Ошибка API (${res.status}): ${data.description || data.code || JSON.stringify(data)}\n`);
  process.exit(1);
}

console.log(`  ✓ Платёж создан: ${data.id}`);
console.log(`  ✓ Тестовый режим: ${data.test ? "да" : "нет"}`);
console.log(`  ✓ Ссылка на оплату: ${data.confirmation?.confirmation_url ? "получена" : "нет"}`);
console.log("\n✅ Ключи ЮKassa работают. Вставьте их в .env и Vercel.\n");
console.log("Тестовая карта (успех): 5555 5555 5555 4477, срок — любой будущий, CVC — любой\n");
