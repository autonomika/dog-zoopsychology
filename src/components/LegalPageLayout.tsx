import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-[calc(76px+3rem)] pb-16 sm:px-8">
      <Link
        href="/"
        className="font-h text-[11px] font-bold uppercase tracking-[0.12em] text-sage hover:text-deep-moss"
      >
        ← На главную
      </Link>
      <h1 className="font-h mt-6 text-3xl font-extrabold uppercase text-charcoal">{title}</h1>
      <p className="font-body mt-2 text-sm text-muted-foreground">Редакция от {updated}</p>
      <article className="legal-prose mt-10 space-y-6 font-body text-[15px] leading-relaxed text-[#3d3d38]">
        {children}
      </article>
      <div className="mt-12 flex flex-wrap gap-4 border-t border-stone pt-6 text-sm">
        <Link href="/offer" className="text-sage hover:text-deep-moss">
          Публичная оферта
        </Link>
        <Link href="/privacy" className="text-sage hover:text-deep-moss">
          Политика конфиденциальности
        </Link>
      </div>
    </div>
  );
}
