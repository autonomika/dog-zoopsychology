"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

export function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone);
    setIsStandalone(!!standalone);
    if (standalone) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIos(ios);
    if (ios) {
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
    setVisible(false);
  }

  if (!visible || isStandalone) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-paper p-4 shadow-lg safe-bottom">
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 text-muted-foreground"
        aria-label="Закрыть"
      >
        <X className="size-4" />
      </button>
      <p className="font-h text-sm font-bold uppercase tracking-wide text-charcoal">
        Установить на телефон
      </p>
      {isIos ? (
        <p className="mt-2 pr-6 font-body text-xs leading-relaxed text-muted-foreground">
          Safari → «Поделиться» → «На экран Домой». Откроется как приложение без адресной строки.
        </p>
      ) : (
        <>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            Быстрый доступ к курсу с главного экрана.
          </p>
          <Button onClick={install} size="sm" className="mt-3 w-full">
            Установить приложение
          </Button>
        </>
      )}
    </div>
  );
}
