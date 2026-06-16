"use client";

export async function startCheckout() {
  const res = await fetch("/api/checkout", { method: "POST" });
  const data = await res.json();

  if (data.url) {
    window.location.href = data.url;
    return { ok: true as const };
  }

  return { ok: false as const, error: data.error || "Оплата недоступна" };
}
