"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Lightbulb, RotateCcw, Timer, XCircle } from "lucide-react";
import type { Question } from "@/lib/tests";
import { Button } from "@/components/ui/button";

type ReviewState = {
  chosenId: string;
  correctId?: string;
  isCorrect: boolean;
};

function shuffledIndices(length: number) {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type MarathonProps = { questions: Question[]; title?: string };

export function ModuleMarathon({ questions, title }: MarathonProps) {
  const [queue, setQueue] = useState<number[]>(() => shuffledIndices(questions.length));
  const [cursor, setCursor] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [review, setReview] = useState<ReviewState | null>(null);

  const currentIndex = queue[cursor];
  const q = questions[currentIndex];
  const percent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const remaining = Math.max(0, queue.length - (cursor + (review ? 1 : 0)));

  const optionClass = (id: string) => {
    if (!review) return "sk9-focus-option sk9-focus-option-neutral";
    if (id === review.correctId) return "sk9-focus-option sk9-focus-option-correct";
    if (id === review.chosenId && !review.isCorrect) return "sk9-focus-option sk9-focus-option-wrong";
    return "sk9-focus-option opacity-75";
  };

  function answer(optionId: string) {
    if (review) return;
    const correctId = q.options.find((o) => o.correct)?.id;
    const isCorrect = optionId === correctId;
    setReview({ chosenId: optionId, correctId, isCorrect });
    setTotalCount((v) => v + 1);
    if (isCorrect) {
      setCorrectCount((v) => v + 1);
      setStreak((v) => v + 1);
    } else {
      setStreak(0);
    }
  }

  function next() {
    if (cursor < queue.length - 1) {
      setCursor((v) => v + 1);
      setReview(null);
      return;
    }
    setQueue(shuffledIndices(questions.length));
    setCursor(0);
    setReview(null);
  }

  function resetMarathon() {
    setQueue(shuffledIndices(questions.length));
    setCursor(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalCount(0);
    setReview(null);
  }

  const motivationalText = useMemo(() => {
    if (!review) return "";
    return review.isCorrect
      ? "Отлично. Закрепляем навык через повторение."
      : "Ошибка — часть обучения. Смотрим подсказку и двигаемся дальше.";
  }, [review]);

  return (
    <div className="space-y-4">
      <div className="sk9-focus-shell space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <p className="inline-flex items-center gap-1.5">
            <Timer className="size-3.5" />
            {title || "Марафон вопросов"}
          </p>
          <p>
            Серия: <span className="font-semibold text-sage">{streak}</span> · Точность:{" "}
            <span className="font-semibold text-charcoal">{percent}%</span>
          </p>
        </div>

        <div className="rounded-xl p-1 sm:p-1">
          <p className="mb-1 text-xs text-muted-foreground">
            Вопрос {cursor + 1} / {queue.length}
          </p>
          <h3 className="mb-5 text-lg font-medium leading-snug text-charcoal">{q.text}</h3>

          <div className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={Boolean(review)}
                onClick={() => answer(opt.id)}
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
                  <CheckCircle2 className="size-4" /> Верно
                </>
              ) : (
                <>
                  <XCircle className="size-4" /> Неверно, но это нормально
                </>
              )}
            </p>
            <p className="mt-2 text-sm">{motivationalText}</p>
            <div className="mt-3 rounded-lg border border-sage/20 bg-white/70 p-3 text-sm text-[#5a5a52]">
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
            Осталось: {remaining} · точность {percent}%
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={resetMarathon} className="w-full sm:w-auto">
              <RotateCcw className="mr-2 size-4" />
              Сбросить
            </Button>
            <Button onClick={next} className="w-full sm:w-auto" disabled={!review}>
              {cursor < queue.length - 1 ? "Следующий вопрос" : "Новый круг"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

