import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { getSession } from "@/lib/session";

export default async function ForgotPasswordPage() {
  if (await getSession()) redirect("/dashboard");
  return <ForgotPasswordForm />;
}
