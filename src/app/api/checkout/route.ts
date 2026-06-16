import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { coursePriceRub, createPayment, isYookassaConfigured } from "@/lib/yookassa";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Войдите в аккаунт" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!isYookassaConfigured()) {
    return NextResponse.json({ error: "Оплата временно недоступна" }, { status: 503 });
  }

  try {
    const returnUrl = `${appUrl}/payment/complete`;
    const { payment, confirmationUrl } = await createPayment({
      userId: session.id,
      email: session.email,
      returnUrl,
      description: "Полный курс «Зоопсихология собаки»",
    });

    await prisma.payment.create({
      data: {
        userId: session.id,
        yookassaId: payment.id,
        amount: coursePriceRub(),
        status: payment.status,
      },
    });

    return NextResponse.json({ url: confirmationUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка создания платежа";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
