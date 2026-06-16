#!/usr/bin/env node
/**
 * Проверка webhook ЮKassa и инструкция по настройке в кабинете.
 * npm run setup:webhook
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://dog-zoopsychology.vercel.app").replace(/\/$/, "");
const webhookUrl = `${appUrl}/api/webhooks/yookassa`;

console.log("\n🔔 Webhook ЮKassa\n");
console.log(`  URL: ${webhookUrl}\n`);

try {
  const res = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  if (res.status === 400 || res.status === 503) {
    console.log(`  ✓ Endpoint доступен (POST → ${res.status}, webhook принимает запросы)`);
  } else {
    console.log(`  ⚠ POST → ${res.status} (ожидался 400 или 503)`);
  }
} catch (error) {
  console.error(`  ❌ Не удалось достучаться до ${webhookUrl}`);
  console.error(`     ${error instanceof Error ? error.message : error}`);
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Настройка в личном кабинете ЮKassa (один раз):

1. Откройте https://yookassa.ru/my
2. Интеграция → HTTP-уведомления
3. URL для уведомлений:
   ${webhookUrl}
4. Отметьте события:
   • payment.succeeded
   • payment.canceled  (опционально)
5. Сохраните

Проверка: после тестовой оплаты в Vercel Logs появится
  [yookassa webhook] payment.succeeded <id> { updated: true }

Без webhook доступ откроется только если пользователь
вернулся на /payment/complete после оплаты.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
