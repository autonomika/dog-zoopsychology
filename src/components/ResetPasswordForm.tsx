"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }

    router.push("/login");
    router.refresh();
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-4 pt-[calc(76px+4rem)] pb-16 text-center">
        <p className="text-sm text-destructive">Ссылка недействительна.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-primary underline-offset-4 hover:underline">
          Запросить новую
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 pt-[calc(76px+4rem)] pb-16">
      <div className="sk9-eyebrow">Новый пароль</div>
      <h1 className="font-h text-2xl font-extrabold uppercase text-charcoal">Сброс пароля</h1>
      <p className="font-sub mt-2 text-sm italic text-muted-foreground">Придумайте новый пароль для входа</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Новый пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Повторите пароль</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="sk9-btn-primary w-full justify-center" disabled={loading}>
          {loading ? "..." : "Сохранить пароль"}
        </Button>
      </form>
    </div>
  );
}
