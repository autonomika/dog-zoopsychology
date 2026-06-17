"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { reachGoal, YM_GOALS } from "@/lib/analytics";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-validation";
import { utmForApi } from "@/lib/utm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email, password } : { email, password, name, ...utmForApi() };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    if (mode === "register") {
      reachGoal(YM_GOALS.REGISTER, utmForApi() as Record<string, string>);
    }
    router.push(mode === "register" ? "/assessment" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 pt-[calc(76px+4rem)] pb-16">
      <div className="sk9-eyebrow">{mode === "register" ? "Регистрация" : "Вход"}</div>
      <h1 className="font-h text-2xl font-extrabold uppercase text-charcoal">
        {mode === "login" ? "Войти" : "Создать аккаунт"}
      </h1>
      <p className="font-sub mt-2 text-sm italic text-muted-foreground">
        {mode === "register" ? "Первый тест бесплатно · ~5 минут" : "Продолжить обучение"}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={MIN_PASSWORD_LENGTH} required />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="sk9-btn-primary w-full justify-center" disabled={loading}>
          {loading ? "..." : mode === "login" ? "Войти" : "Создать аккаунт"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Регистрация
              </Link>
            </>
          ) : (
            <>
              Есть аккаунт?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Войти
              </Link>
            </>
          )}
        </p>
        {mode === "register" && (
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Регистрируясь, вы соглашаетесь с{" "}
            <Link href="/privacy" className="text-sage underline-offset-2 hover:underline">
              политикой конфиденциальности
            </Link>{" "}
            и{" "}
            <Link href="/offer" className="text-sage underline-offset-2 hover:underline">
              офертой
            </Link>
            .
          </p>
        )}
      </form>
    </div>
  );
}
