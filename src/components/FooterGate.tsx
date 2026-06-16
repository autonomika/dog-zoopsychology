"use client";

import { usePathname } from "next/navigation";

/** На главной свой marketing-footer — глобальный SiteFooter не показываем. */
export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}
