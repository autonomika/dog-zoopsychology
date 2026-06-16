import { headers } from "next/headers";
import { SiteFooter } from "@/components/SiteFooter";

export async function ConditionalSiteFooter() {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname === "/") return null;
  return <SiteFooter />;
}
