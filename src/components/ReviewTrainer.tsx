"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReviewQuestion = {
  attemptId: string;
  moduleId: string;
  moduleTitle: string;
  questionId: string;
  text: string;
  explanation: string;
  reviewStage: number;
  options: { id: string; text: string }[];
  correctId: string;
};

type ReviewState = {
  chosenId: string;
  isCorrect: boolean;
  nextInDays?: number;
  done: boolean;
};

export function ReviewTrainer({ items }: { items: ReviewQuestion[] }) {
  const [queue, setQueue] = useState(items);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewState | null>(null);
  const [error, setError] = useState("");
  const [doneCount, setDoneCount] = useState(0);

  const current = queue[index];
  const progress = queue.length > 0 ? Math.round((doneCount / queue.length) * 100) : 100;
  const remaining = Math.max(0, queue.length - doneCount - (review ? 1 : 0));

  async function answer(optionId: string) {
    if (!current || review || loading) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/review/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId: current.attemptId, chosenId: optionId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    setReview({
      chosenId: optionId,
      isCorrect: Boolean(data.isCorrect),
      nextInDays: typeof data.nextInDays === "number" ? data.nextInDays : undefined,
      done: Boolean(data.done),
    });
    setDoneCount((v) => v + 1);
  }

  function next() {
    if (!current || !review) return;
    if (!review.done) {
      // Keep question in queue for future days but remove from today's session.
      setQueue((prev) => prev.filter((item) => item.attemptId !== current.attemptId));
      if (index > 0) setIndex((v) => v - 1);
    } else if (index < queue.length - 1) {
      setIndex((v) => v + 1);
    } else {
      setQueue((prev) => prev.filter((item) => item.attemptId !== current.attemptId));
      if (index > 0) setIndex((v) => v - 1);
    }
    setReview(null);
  }

  const optionClass = (id: string) => {
    if (!current) return "sk9-focus-option sk9-focus-option-neutral";
    if (!review) return "sk9-focus-option sk9-focus-option-neutral";
    if (id === current.correctId) return "sk9-focus-option sk9-focus-option-correct";
    if (id === review.chosenId && !review.isCorrect) return "sk9-focus-option sk9-focus-option-wrong";
    return "sk9-focus-option opacity-75";
  };

  const stageLabel = useMemo(() => {
    if (!current) return "";
    if (current.reviewStage <= 0) return "Этап 1/3";
    if (current.reviewStage === 1) return "Этап 2/3";
    return "Этап 3/3";
  }, [current]);

  if (queue.length === 0 || !current) {
    return (
      <div className="sk9-focus-shell text-center">
        <p className="font-medium text-charcoal">Сегодня повторений нет</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Отлично! Следующая порция вопросов появится по расписанию 1/3/7 дней.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sk9-focus-shell">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            В очереди: {queue.length} · {stageLabel}
          </p>
          <p>
            Прогресс: <span className="font-semibold text-sage">{progress}%</span>
          </p>
        </div>

        <div className="sk9-focus-progress mb-6">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="rounded-xl p-1 sm:p-1">
          <p className="mb-1 text-xs text-muted-foreground">{current.moduleTitle}</p>
          <h2 className="mb-5 text-lg font-medium leading-snug text-charcoal">{current.text}</h2>

          <div className="space-y-2">
            {current.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={Boolean(review) || loading}
                onClick={() => answer(opt.id)}
                className={optionClass(opt.id)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        {review && (
          <div className={`mt-3 sk9-feedback-card ${review.isCorrect ? "sk9-feedback-good" : "sk9-feedback-growth"}`}>
            <p className="inline-flex items-center gap-2 font-medium">
              {review.isCorrect ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Верно
                </>
              ) : (
                <>
                  <XCircle className="size-4" />
                  Неверно — повторим завтра
                </>
              )}
            </p>
            <p className="mt-2 text-sm">
              {review.isCorrect
                ? review.nextInDays
                  ? `Отлично. Следующий повтор через ${review.nextInDays} дн.`
                  : "Навык закреплен, вопрос снят с повторения."
                : "Спокойно, ошибки — часть обучения. Увидите этот вопрос снова по графику."}
            </p>
            <div className="mt-3 rounded-lg border border-sage/20 bg-white/75 p-3 text-sm text-[#5a5a52]">
              <p className="inline-flex items-center gap-1.5 font-medium text-charcoal">
                <Lightbulb className="size-4 text-sage" />
                Подсказка теории
              </p>
              <p className="mt-1">{current.explanation}</p>
            </div>
          </div>
        )}
      </div>

      <div className="sk9-sticky-cta mt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Осталось: {remaining} · прогресс {progress}%
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setQueue(items);
                setIndex(0);
                setReview(null);
                setError("");
                setDoneCount(0);
              }}
            >
              <RotateCcw className="mr-2 size-4" />
              Перезапустить
            </Button>
            <Button onClick={next} className="w-full sm:w-auto" disabled={!review}>
              Следующий вопрос
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

