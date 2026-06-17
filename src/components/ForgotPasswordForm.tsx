"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }

    setMessage(data.message);
  }

  return (
    <div className="mx-auto max-w-sm px-4 pt-[calc(76px+4rem)] pb-16">
      <div className="sk9-eyebrow">Восстановление</div>
      <h1 className="font-h text-2xl font-extrabold uppercase text-charcoal">Забыли пароль?</h1>
      <p className="font-sub mt-2 text-sm italic text-muted-foreground">
        Отправим ссылку для сброса на email, указанный при регистрации
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-sage">{message}</p>}
        <Button type="submit" className="sk9-btn-primary w-full justify-center" disabled={loading}>
          {loading ? "..." : "Отправить ссылку"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            ← Вернуться ко входу
          </Link>
        </p>
      </form>
    </div>
  );
}
