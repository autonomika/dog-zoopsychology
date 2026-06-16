"use client";

import { useState } from "react";
import type { Module } from "@/lib/course/types";
import { TheoryReader } from "@/components/TheoryReader";
import { TestRunner } from "@/components/TestRunner";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList } from "lucide-react";

export function CourseFlow({ module }: { module: Module }) {
  const [phase, setPhase] = useState<"theory" | "test">("theory");

  return (
    <div>
      <div className="mb-8 flex gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setPhase("theory")}
          className={`flex items-center gap-2 border-b-2 px-1 pb-2 text-sm font-medium transition-colors ${
            phase === "theory"
              ? "border-sage text-charcoal"
              : "border-transparent text-muted-foreground hover:text-charcoal"
          }`}
        >
          <BookOpen className="size-4" />
          Теория
        </button>
        <button
          type="button"
          onClick={() => setPhase("test")}
          className={`flex items-center gap-2 border-b-2 px-1 pb-2 text-sm font-medium transition-colors ${
            phase === "test"
              ? "border-sage text-charcoal"
              : "border-transparent text-muted-foreground hover:text-charcoal"
          }`}
        >
          <ClipboardList className="size-4" />
          Тест
        </button>
      </div>

      {phase === "theory" ? (
        <div>
          <p className="mb-6 font-body text-sm text-muted-foreground">
            Изучите материал самостоятельно, затем проверьте себя тестом.
          </p>
          <TheoryReader sections={module.theory} />
          <Button onClick={() => setPhase("test")} className="mt-8 w-full">
            Перейти к тесту →
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-6 font-body text-sm text-muted-foreground">
            {module.questions.length} вопросов · проверка понимания темы
          </p>
          <TestRunner module={module} />
          <Button variant="ghost" onClick={() => setPhase("theory")} className="mt-6 w-full">
            ← Вернуться к теории
          </Button>
        </div>
      )}
    </div>
  );
}
