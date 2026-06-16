import { prisma } from "@/lib/db";
import { getPayment, type YooPayment } from "@/lib/yookassa";

export async function syncPaymentFromYookassa(paymentId: string) {
  const remote = await getPayment(paymentId);
  return markUserPaidFromPayment(remote);
}

export async function markUserPaidFromPayment(payment: YooPayment) {
  const userId = payment.metadata?.userId;
  if (!userId) return { updated: false, reason: "missing-user-id" as const };

  const record = await prisma.payment.findUnique({
    where: { yookassaId: payment.id },
  });
  if (!record) return { updated: false, reason: "unknown-payment" as const };

  if (record.userId !== userId) {
    return { updated: false, reason: "user-mismatch" as const };
  }

  const status = payment.status;
  await prisma.payment.update({
    where: { id: record.id },
    data: { status },
  });

  if (status !== "succeeded" || !payment.paid) {
    return { updated: false, reason: "not-succeeded" as const };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { paid: true },
  });

  return { updated: true as const };
}
