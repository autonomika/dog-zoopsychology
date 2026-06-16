import type { Module } from "./types";
import { MODULES_PART1 } from "./modules-part1";
import { MODULES_PART2 } from "./modules-part2";

export const MODULES: Module[] = [...MODULES_PART1, ...MODULES_PART2];

export function getModule(id: string) {
  return MODULES.find((m) => m.id === id);
}

export function scoreModule(module: Module, answers: Record<string, string>) {
  let score = 0;
  for (const q of module.questions) {
    const chosen = answers[q.id];
    const correct = q.options.find((o) => o.correct);
    if (correct && chosen === correct.id) score += 1;
  }
  return { score, maxScore: module.questions.length };
}

export function getResult(module: Module, score: number) {
  return (
    module.results.find((r) => score >= r.min && score <= r.max) ||
    module.results[module.results.length - 1]
  );
}

export function isModuleUnlocked(
  module: Module,
  paid: boolean,
  completedIds: string[]
): boolean {
  if (module.free) return true;
  if (!paid) return false;
  const introDone = completedIds.includes("intro");
  if (!introDone) return false;
  const idx = MODULES.findIndex((m) => m.id === module.id);
  if (idx <= 0) return true;
  const prev = MODULES[idx - 1];
  return completedIds.includes(prev.id);
}

export type { Module, Question, TheorySection } from "./types";
