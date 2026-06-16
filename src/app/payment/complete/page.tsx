import { redirect } from "next/navigation";
import { markUserPaidFromPayment } from "@/lib/payments";
import { getCurrentUser } from "@/lib/user";
import { getPayment, isYookassaConfigured } from "@/lib/yookassa";

export default async function PaymentCompletePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.paid) redirect("/dashboard?paid=1");

  if (!isYookassaConfigured()) {
    redirect("/dashboard?paid=0");
  }

  const latest = user.payments
    ?.filter((p) => p.status !== "succeeded")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  const paymentRecord = latest ?? user.payments?.[0];
  if (!paymentRecord) redirect("/dashboard?paid=0");

  try {
    const remote = await getPayment(paymentRecord.yookassaId);
    const result = await markUserPaidFromPayment(remote);
    if (result.updated) redirect("/dashboard?paid=1");
    if (remote.status === "canceled") redirect("/dashboard?paid=0");
  } catch {
    redirect("/dashboard?paid=pending");
  }

  redirect("/dashboard?paid=pending");
}
