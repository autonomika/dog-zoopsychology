import { NextResponse } from "next/server";
import { syncPaymentFromYookassa } from "@/lib/payments";
import { isYookassaConfigured, type YooWebhookNotification } from "@/lib/yookassa";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isYookassaConfigured()) {
    return NextResponse.json({ error: "Сервис не настроен" }, { status: 503 });
  }

  let notification: YooWebhookNotification;
  try {
    notification = (await req.json()) as YooWebhookNotification;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (notification.type !== "notification") {
    return NextResponse.json({ received: true });
  }

  const paymentId = notification.object?.id;
  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
  }

  const handledEvents = new Set([
    "payment.succeeded",
    "payment.waiting_for_capture",
    "payment.canceled",
  ]);

  if (!handledEvents.has(notification.event)) {
    return NextResponse.json({ received: true, skipped: notification.event });
  }

  try {
    const result = await syncPaymentFromYookassa(paymentId);
    console.info("[yookassa webhook]", notification.event, paymentId, result);
    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    console.error("[yookassa webhook]", notification.event, paymentId, error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
