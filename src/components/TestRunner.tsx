"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import type { Module } from "@/lib/tests";
import { PurchaseButton } from "@/components/PurchaseButton";
import { Button } from "@/components/ui/button";

type SubmitResponse = {
  score: number;
  maxScore: number;
  percent: number;
  passScore: number;
  passed: boolean;
  result: { title: string; text: string; tips: string[] };
  explanations: {
    id: string;
    text: string;
    explanation: string;
    correctId?: string;
    chosenId?: string;
    isCorrect?: boolean;
  }[];
  needsPayment?: boolean;
};

type ReviewState = {
  chosenId: string;
  correctId?: string;
  isCorrect: boolean;
};

export function TestRunner({ module }: { module: Module }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>(
    () => module.questions.map((_, i) => i)
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewState | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState("");

  const q = module.questions[questionOrder[step]];
  const progress = ((step + (review ? 1 : 0)) / questionOrder.length) * 100;
  const remainingQuestions = Math.max(0, questionOrder.length - (step + (review ? 1 : 0)));
  const etaMinutes = Math.max(1, Math.ceil((remainingQuestions * 25) / 60));
  const correctSoFar = useMemo(() => {
    let total = 0;
    for (const question of module.questions) {
      const chosen = answers[question.id];
      const correct = question.options.find((o) => o.correct)?.id;
      if (chosen && chosen === correct) total += 1;
    }
    return total;
  }, [answers, module.questions]);

  async function finish(finalAnswers: Record<string, string>) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/test/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId: module.id, answers: finalAnswers }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    setResult(data);
    router.refresh();
  }

  function choose(optionId: string) {
    if (review) return;
    setError("");
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    const correctId = q.options.find((o) => o.correct)?.id;
    setReview({ chosenId: optionId, correctId, isCorrect: optionId === correctId });
  }

  async function goNext() {
    if (!review) return;
    const finalAnswers = { ...answers, [q.id]: review.chosenId };
    if (step < questionOrder.length - 1) {
      setStep((s) => s + 1);
      setReview(null);
      return;
    }
    await finish(finalAnswers);
  }

  function optionClass(optionId: string) {
    if (!review) return "sk9-focus-option sk9-focus-option-neutral";
    if (optionId === review.correctId) return "sk9-focus-option sk9-focus-option-correct";
    if (optionId === review.chosenId && !review.isCorrect) {
      return "sk9-focus-option sk9-focus-option-wrong";
    }
    return "sk9-focus-option opacity-75";
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
          <p className="mt-2 text-xs text-muted-foreground">
            Порог освоения: {result.passScore}/{result.maxScore} (80%)
          </p>
          <p className={`mt-2 text-sm ${result.passed ? "text-[var(--success)]" : "text-[#7b3a34]"}`}>
            {result.passed
              ? "Модуль засчитан. Отличная динамика."
              : "Модуль не засчитан: это нормально, повторите ошибки и усилите навык."}
          </p>
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

        {!result.passed && (
          <Button
            variant="outline"
            onClick={() => {
              const nextAnswers = Object.fromEntries(
                result.explanations
                  .filter((ex) => ex.chosenId)
                  .map((ex) => [ex.id, ex.chosenId as string])
              );
              const wrongOnly = result.explanations
                .filter((ex) => ex.chosenId !== ex.correctId)
                .map((ex) => module.questions.findIndex((item) => item.id === ex.id))
                .filter((idx) => idx >= 0);

              setAnswers(nextAnswers);
              setQuestionOrder(wrongOnly.length > 0 ? wrongOnly : module.questions.map((_, i) => i));
              setStep(0);
              setReview(null);
              setResult(null);
              setError("");
            }}
            className="w-full"
          >
            Повторить только ошибки
          </Button>
        )}

        {result.needsPayment && <Paywall />}

        <Button asChild className="w-full">
          <Link href="/dashboard">К модулям</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sk9-focus-shell">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            Вопрос {step + 1} / {questionOrder.length}
          </p>
          <p>
            Верных ответов: <span className="font-semibold text-sage">{correctSoFar}</span>
          </p>
        </div>
        <p className="mb-3 text-xs text-[#5a5a52]">
          Осталось: {remainingQuestions} · ориентир по времени: ~{etaMinutes} мин
        </p>

        <div className="sk9-focus-progress mb-6">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="rounded-xl p-1 sm:p-1">
          <h2 className="mb-6 text-lg font-medium leading-snug">{q.text}</h2>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={Boolean(review)}
                onClick={() => choose(opt.id)}
                className={optionClass(opt.id)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {review && (
          <div
            className={`sk9-feedback-card ${
              review.isCorrect ? "sk9-feedback-good" : "sk9-feedback-growth"
            }`}
          >
            <p className="inline-flex items-center gap-2 font-medium">
              {review.isCorrect ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Верно
                </>
              ) : (
                <>
                  <XCircle className="size-4" />
                  Неверно, но это часть обучения
                </>
              )}
            </p>

            <p className="mt-2 text-sm">
              {review.isCorrect
                ? "Отличная работа. Закрепим этот шаг и перейдем дальше."
                : "Пауза на разбор. Ошибка помогает мозгу запомнить правильный путь лучше."}
            </p>

            <div className="mt-3 rounded-lg border border-sage/20 bg-white/75 p-3 text-sm text-[#5a5a52]">
              <p className="inline-flex items-center gap-1.5 font-medium text-charcoal">
                <Lightbulb className="size-4 text-sage" />
                Подсказка теории
              </p>
              <p className="mt-1">{q.explanation}</p>
            </div>
          </div>
        )}
      </div>

      <div className="sk9-sticky-cta mt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Осталось: {remainingQuestions} · ~{etaMinutes} мин
          </div>
          <Button onClick={goNext} className="w-full sm:w-auto" disabled={!review}>
            {step < questionOrder.length - 1 ? "Следующий вопрос" : "Завершить тест"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Paywall() {
  return (
    <div className="rounded-lg border border-sage/30 bg-[linear-gradient(180deg,#f8faf5_0%,#f2f6ef_100%)] p-4">
      <p className="font-h text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
        Полный доступ к курсу
      </p>
      <p className="mt-2 font-medium text-charcoal">Откройте все модули в обоих треках</p>
      <p className="mt-1 text-xs text-muted-foreground">Разово, без подписки</p>
      <div className="mt-4">
        <PurchaseButton />
      </div>
    </div>
  );
}
