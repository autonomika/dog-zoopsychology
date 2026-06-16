import Link from "next/link";
import { PORTFOLIO_AUTHOR, PORTFOLIO_YEAR, siteUrl } from "@/lib/site";

export function SiteFooter() {
  const github = process.env.NEXT_PUBLIC_GITHUB_URL?.trim();

  return (
    <footer className="border-t border-stone bg-[#fafaf8] px-5 py-8 sm:px-12">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-h text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal">
            Pet project · {PORTFOLIO_YEAR} · {PORTFOLIO_AUTHOR}
          </p>
          <p className="font-body mt-1 text-xs text-muted-foreground">
            Next.js · PostgreSQL · ЮKassa · PWA
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link href="/offer" className="text-sage hover:text-deep-moss">
            Оферта
          </Link>
          <Link href="/privacy" className="text-sage hover:text-deep-moss">
            Конфиденциальность
          </Link>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage hover:text-deep-moss"
            >
              GitHub
            </a>
          )}
          <a
            href={siteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-charcoal"
          >
            Live demo
          </a>
        </div>
      </div>
    </footer>
  );
}
