import { randomUUID } from "crypto";
import { coursePriceRaw } from "@/lib/pricing";

const API_URL = "https://api.yookassa.ru/v3";

export type YooPayment = {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  paid: boolean;
  amount: { value: string; currency: string };
  confirmation?: { type: string; confirmation_url?: string };
  metadata?: Record<string, string>;
};

export type YooWebhookNotification = {
  type: "notification";
  event: string;
  object: YooPayment;
};

function credentials() {
  const shopId = process.env.YOOKASSA_SHOP_ID?.trim();
  const secretKey = process.env.YOOKASSA_SECRET_KEY?.trim();
  if (!shopId || !secretKey || shopId.includes("...") || secretKey.includes("...")) {
    return null;
  }
  return { shopId, secretKey };
}

export function isYookassaConfigured() {
  return credentials() !== null;
}

function authHeader() {
  const creds = credentials();
  if (!creds) throw new Error("ЮKassa не настроена");
  const token = Buffer.from(`${creds.shopId}:${creds.secretKey}`).toString("base64");
  return `Basic ${token}`;
}

export function formatRubAmount(rub: number | string) {
  const value = typeof rub === "string" ? Number.parseFloat(rub) : rub;
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Некорректная сумма оплаты");
  }
  return value.toFixed(2);
}

export function coursePriceRub() {
  return formatRubAmount(coursePriceRaw());
}

export async function createPayment(input: {
  userId: string;
  email: string;
  returnUrl: string;
  description: string;
}) {
  const amount = coursePriceRub();
  const body: Record<string, unknown> = {
    amount: {
      value: amount,
      currency: "RUB",
    },
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: input.returnUrl,
    },
    description: input.description,
    metadata: {
      userId: input.userId,
    },
  };

  if (process.env.YOOKASSA_SEND_RECEIPT === "true") {
    body.receipt = {
      customer: { email: input.email },
      items: [
        {
          description: input.description,
          quantity: "1.00",
          amount: { value: amount, currency: "RUB" },
          vat_code: 1,
          payment_mode: "full_payment",
          payment_subject: "service",
        },
      ],
    };
  }

  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": randomUUID(),
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as YooPayment & { description?: string; code?: string };
  if (!res.ok) {
    const message = data.description || data.code || `HTTP ${res.status}`;
    throw new Error(`ЮKassa: ${message}`);
  }

  const confirmationUrl = data.confirmation?.confirmation_url;
  if (!confirmationUrl) {
    throw new Error("ЮKassa не вернула ссылку на оплату");
  }

  return { payment: data, confirmationUrl };
}

export async function getPayment(paymentId: string) {
  const res = await fetch(`${API_URL}/payments/${paymentId}`, {
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = (await res.json()) as YooPayment & { description?: string };
  if (!res.ok) {
    throw new Error(data.description || `ЮKassa: HTTP ${res.status}`);
  }

  return data;
}
