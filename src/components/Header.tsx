import Link from "next/link";
import { getSession } from "@/lib/session";
import { PawPrint } from "lucide-react";

export async function Header() {
  const session = await getSession();

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] border-b border-sage/15 bg-charcoal">
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3 no-underline">
          <span className="flex size-[50px] items-center justify-center rounded-full bg-sage/20">
            <PawPrint className="size-6 text-sage" />
          </span>
          <span className="font-h text-lg font-extrabold uppercase tracking-wider text-[#fefefe]">
            Зоопсихология
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {session ? (
            <Link
              href="/dashboard"
              className="sk9-btn-primary px-[22px] py-2.5 text-xs tracking-[0.1em]"
            >
              Мой курс
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden font-h text-xs font-bold uppercase tracking-[0.1em] text-soft-sage transition-colors hover:text-[#fefefe] sm:block"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="sk9-btn-primary px-[22px] py-2.5 text-xs tracking-[0.1em]"
              >
                Пройти тест
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
