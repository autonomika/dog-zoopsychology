import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { getSession } from "@/lib/session";

export default async function ResetPasswordPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
