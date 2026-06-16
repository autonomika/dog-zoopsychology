"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Module } from "@/lib/tests";
import { startCheckout } from "@/lib/startCheckout";
import { Button } from "@/components/ui/button";

type SubmitResponse = {
  score: number;
  maxScore: number;
  percent: number;
  result: { title: string; text: string; tips: string[] };
  explanations: {
    id: string;
    text: string;
    explanation: string;
    correctId?: string;
    chosenId?: string;
  }[];
  needsPayment?: boolean;
};

export function TestRunner({ module }: { module: Module }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);

  useEffect(() => {
    setLocked(false);
  }, [step]);

  const q = module.questions[step];
  const progress = ((step + 1) / module.questions.length) * 100;

  async function finish(finalAnswers: Record<string, string>) {
    setLoading(true);
    const res = await fetch("/api/test/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId: module.id, answers: finalAnswers }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      alert(data.error || "Ошибка");
      return;
    }
    setResult(data);
    router.refresh();
  }

  function choose(optionId: string) {
    if (locked) return;
    setLocked(true);
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    if (step < module.questions.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 200);
    } else {
      finish(next);
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Считаем результат...</p>;
  }

  if (result) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Результат</p>
          <p className="mt-1 font-display text-4xl font-semibold text-primary">
            {result.score}/{result.maxScore}
          </p>
          <p className="mt-2 font-medium">{result.result.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{result.result.text}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">Рекомендации</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.result.tips.map((tip, i) => (
              <li key={i}>· {tip}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <p className="text-sm font-medium">Разбор</p>
          {result.explanations.map((ex, i) => {
            const ok = ex.chosenId === ex.correctId;
            return (
              <div key={ex.id} className="text-sm">
                <p className="font-medium">
                  {i + 1}. {ex.text}
                </p>
                <p className={ok ? "text-[var(--success)]" : "text-destructive"}>
                  {ok ? "Верно" : "Неверно"}
                </p>
                <p className="text-muted-foreground">{ex.explanation}</p>
              </div>
            );
          })}
        </div>

        {result.needsPayment && <Paywall />}

        <Button asChild className="w-full">
          <Link href="/dashboard">К модулям</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mb-1 text-xs text-muted-foreground">
        {step + 1} / {module.questions.length}
      </p>
      <h2 className="mb-6 text-lg font-medium leading-snug">{q.text}</h2>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={locked}
            onClick={() => choose(opt.id)}
            className="w-full rounded-[var(--radius-button)] border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-muted/50 disabled:opacity-50"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function Paywall() {
  const [loading, setLoading] = useState(false);
  const price = process.env.NEXT_PUBLIC_COURSE_PRICE || "1990";

  async function buy() {
    setLoading(true);
    const result = await startCheckout();
    if (!result.ok) alert(result.error);
    setLoading(false);
  }

  return (
    <div className="rounded-lg border border-border p-4 text-center">
      <p className="font-medium">Откройте полный курс</p>
      <p className="mt-1 text-2xl font-semibold">{price} ₽</p>
      <p className="mt-1 text-xs text-muted-foreground">Разово, без подписки</p>
      <Button onClick={buy} disabled={loading} className="mt-4 w-full">
        {loading ? "..." : `Оплатить ${price} ₽ через ЮKassa`}
      </Button>
    </div>
  );
}
