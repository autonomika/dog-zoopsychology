"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "zoopsych-popup-dismissed";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80";

export function LandingPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      if (last && Date.now() - last < COOLDOWN_MS) return;
    } catch {
      /* ignore */
    }

    let opened = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    function showPopup() {
      if (opened) return;
      opened = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      setOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        } catch {
          /* ignore */
        }
      }, 3000);
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      function onScroll() {
        const denom = document.body.scrollHeight - window.innerHeight || 1;
        if (window.scrollY / denom > 0.5) {
          window.removeEventListener("scroll", onScroll);
          showPopup();
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      fallbackTimer = setTimeout(showPopup, 20000);
    } else {
      function onMouseOut(e: MouseEvent) {
        if (e.clientY <= 0) {
          document.removeEventListener("mouseout", onMouseOut);
          showPopup();
        }
      }
      document.addEventListener("mouseout", onMouseOut);
      fallbackTimer = setTimeout(showPopup, 30000);
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  function close() {
    setVisible(false);
    setTimeout(() => setOpen(false), 260);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-[rgba(14,16,12,0.78)] p-4 backdrop-blur-sm transition-opacity duration-250 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-hidden={!visible}
    >
      <div
        className={`relative w-full max-w-[520px] overflow-hidden rounded-sm bg-charcoal shadow-[0_40px_100px_rgba(0,0,0,0.65),0_0_0_1px_rgba(129,143,107,0.15)] transition-all duration-[380ms] ease-[cubic-bezier(0.34,1.42,0.64,1)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.93] opacity-0"}`}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-2.5 right-2.5 z-10 flex size-[30px] cursor-pointer items-center justify-center rounded-full border-none bg-black/35 text-base text-white/80 transition-colors hover:bg-black/55 hover:text-white"
          aria-label="Закрыть"
        >
          ×
        </button>

        <div
          className="relative h-[180px] bg-cover bg-center sm:h-[180px]"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/5 to-charcoal/90" />
          <span className="absolute bottom-3.5 left-5 z-[2] font-h text-[11px] font-extrabold uppercase tracking-[0.18em] text-soft-sage/90">
            Бесплатно · без обязательств
          </span>
        </div>

        <div className="px-5 pt-7 pb-8 sm:px-8 sm:pb-8">
          <h2 className="font-h text-[clamp(1.75rem,6vw,2.625rem)] leading-[0.97] font-extrabold uppercase tracking-wide text-[#fefefe]">
            Что управляет
            <br />
            <em>поведением</em> собаки?
          </h2>
          <p className="font-sub mt-3 max-w-[380px] text-sm italic leading-relaxed text-soft-sage">
            Узнайте тип поведения и получите рекомендации — что делать в первую очередь.
          </p>

          <div className="mt-5 mb-6 flex flex-col gap-2 border-l-2 border-sage bg-white/[0.04] p-4">
            {[
              "Поймите, почему собака реагирует или игнорирует",
              "Получите профиль поведения и разбор",
              "Узнайте, на чём сфокусироваться",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2.5 font-body text-[13px] leading-snug text-stone">
                <span className="sk9-check mt-0.5 size-4 shrink-0" />
                {text}
              </div>
            ))}
          </div>

          <Link
            href="/register"
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
              } catch {
                /* ignore */
              }
            }}
            className="sk9-btn-primary sk9-btn-lg mb-3 w-full justify-center text-[17px]"
          >
            Начать бесплатный тест
            <span>→</span>
          </Link>
          <button
            type="button"
            onClick={close}
            className="w-full cursor-pointer border-none bg-transparent py-1 font-h text-[11px] font-bold uppercase tracking-[0.1em] text-[#4a4a42] transition-colors hover:text-sage"
          >
            Нет, разберусь сам
          </button>
        </div>
      </div>
    </div>
  );
}
