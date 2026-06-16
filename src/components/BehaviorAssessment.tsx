"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BEHAVIOR_QUESTIONS, type BehaviorType } from "@/lib/behavior-quiz";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SubmitResult = {
  primaryType: BehaviorType;
  percentages: Record<string, number>;
  allTypes: (BehaviorType & { percent: number })[];
  dogName: string;
};

type Props = {
  initialProfile?: { dogName: string; dogBreed: string; dogAge: string };
  isRetake?: boolean;
};

export function BehaviorAssessment({ initialProfile, isRetake }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"profile" | "quiz" | "result">("profile");
  const [dogName, setDogName] = useState(initialProfile?.dogName ?? "");
  const [dogBreed, setDogBreed] = useState(initialProfile?.dogBreed ?? "");
  const [dogAge, setDogAge] = useState(initialProfile?.dogAge ?? "");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState("");

  const q = BEHAVIOR_QUESTIONS[step];
  const progress = phase === "quiz" ? ((step + 1) / BEHAVIOR_QUESTIONS.length) * 100 : 0;

  async function submitAssessment(finalAnswers: Record<string, string>) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/assessment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dogName, dogBreed, dogAge, answers: finalAnswers }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    setResult(data);
    setPhase("result");
    router.refresh();
  }

  function choose(optionId: string) {
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    if (step < BEHAVIOR_QUESTIONS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 150);
    } else {
      submitAssessment(next);
    }
  }

  if (phase === "profile") {
    return (
      <div className="mx-auto max-w-md px-4 pt-[calc(76px+2.5rem)] pb-16">
        <div className="sk9-eyebrow">Шаг 1 из 2</div>
        <h1 className="sk9-h2 sk9-h2-dark text-[clamp(1.75rem,5vw,2.5rem)]">Расскажите о собаке</h1>
        <p className="font-sub mt-3 text-sm italic text-muted-foreground">
          Имя, порода, возраст — начнём с того, кто ваша собака.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!dogName.trim()) return;
            setPhase("quiz");
          }}
          className="mt-8 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="dogName">Имя собаки *</Label>
            <Input id="dogName" value={dogName} onChange={(e) => setDogName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dogBreed">Порода</Label>
            <Input id="dogBreed" value={dogBreed} onChange={(e) => setDogBreed(e.target.value)} placeholder="Метис, лабрадор..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dogAge">Возраст</Label>
            <Input id="dogAge" value={dogAge} onChange={(e) => setDogAge(e.target.value)} placeholder="2 года, щенок..." />
          </div>
          <button type="submit" className="sk9-btn-primary mt-2 w-full justify-center">
            Далее — вопросы о поведении
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 pt-[calc(76px+6rem)] pb-16 text-center">
        <p className="font-sub text-sm italic text-muted-foreground">Считаем профиль поведения...</p>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-[calc(76px+2.5rem)] pb-16">
        <div className="sk9-eyebrow">Результат</div>
        <h1 className="sk9-h2 sk9-h2-dark text-[clamp(1.75rem,5vw,2.5rem)]">
          Профиль <em>{result.dogName}</em>
        </h1>

        <div className="mt-8 border-t-[3px] border-sage bg-paper p-6">
          <p className="font-h text-[10px] font-bold uppercase tracking-[0.16em] text-sage">
            Доминирующий тип
          </p>
          <h2 className="font-h mt-2 text-3xl font-extrabold uppercase text-charcoal">
            {result.primaryType.title}
          </h2>
          <p className="font-body mt-3 text-sm leading-relaxed text-[#5a5a52]">
            {result.primaryType.desc}
          </p>
          <ul className="mt-4 space-y-2">
            {result.primaryType.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 font-body text-sm text-[#6a6a62]">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-sage" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 space-y-3">
          <p className="font-h text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Все типы (%)
          </p>
          {result.allTypes
            .sort((a, b) => b.percent - a.percent)
            .map((t) => (
              <div key={t.id}>
                <div className="mb-1 flex justify-between font-body text-sm">
                  <span>{t.title}</span>
                  <span className="text-sage">{t.percent}%</span>
                </div>
                <div className="h-1.5 bg-stone">
                  <div className="h-full bg-sage transition-all" style={{ width: `${t.percent}%` }} />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Link href="/learn/intro" className="sk9-btn-primary w-full justify-center">
            Пройти обучающий тест
          </Link>
          <Link href="/dashboard" className="sk9-btn-outline !border-charcoal/25 !text-charcoal w-full justify-center hover:!bg-charcoal/5">
            К модулям
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-[calc(76px+2.5rem)] pb-16">
      <div className="sk9-eyebrow">Шаг 2 — {dogName}</div>
      <div className="mb-6 h-1 bg-stone">
        <div className="h-full bg-sage transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="font-h text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {step + 1} / {BEHAVIOR_QUESTIONS.length}
      </p>
      <h2 className="mt-3 mb-6 font-body text-lg leading-snug font-medium">{q.text}</h2>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => choose(opt.id)}
            className="w-full rounded-[var(--radius-button)] border border-stone bg-[#fefefe] px-4 py-3.5 text-left font-body text-sm transition-colors hover:border-sage hover:bg-paper"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
