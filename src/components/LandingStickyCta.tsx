"use client";

import Link from "next/link";

export function LandingStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[9990] border-t border-sage/20 bg-charcoal-2 p-3 md:hidden">
      <Link href="/register" className="sk9-btn-primary sk9-btn-lg w-full justify-center">
        Начать бесплатный тест
      </Link>
    </div>
  );
}
