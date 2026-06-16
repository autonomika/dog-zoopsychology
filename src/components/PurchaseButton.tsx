"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { startCheckout } from "@/lib/startCheckout";

export function PurchaseButton() {
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const price = process.env.NEXT_PUBLIC_COURSE_PRICE || "1990";

  async function buy() {
    if (!accepted) return;
    setLoading(true);
    const result = await startCheckout();
    if (!result.ok) alert(result.error);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-2.5 font-body text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-sage"
        />
        <span>
          Я принимаю{" "}
          <Link href="/offer" className="text-sage underline-offset-2 hover:underline">
            публичную оферту
          </Link>{" "}
          и{" "}
          <Link href="/privacy" className="text-sage underline-offset-2 hover:underline">
            политику конфиденциальности
          </Link>
        </span>
      </label>
      <Button onClick={buy} disabled={loading || !accepted} className="w-full">
        {loading ? "..." : `Оплатить ${price} ₽ через ЮKassa`}
      </Button>
    </div>
  );
}
