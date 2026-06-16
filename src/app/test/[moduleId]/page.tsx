import { redirect } from "next/navigation";

export default async function TestRedirectPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  redirect(`/learn/${moduleId}`);
}
