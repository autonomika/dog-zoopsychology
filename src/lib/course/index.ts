import type { Module } from "./types";
import { MODULES_PART1 } from "./modules-part1";
import { MODULES_PART2 } from "./modules-part2";
import { MODULES_TRAINING } from "./modules-training";

export const MODULES: Module[] = [...MODULES_PART1, ...MODULES_TRAINING, ...MODULES_PART2];

export type LearningTrackId = "behavior-psychology" | "training";

export const LEARNING_TRACKS: Record<
  LearningTrackId,
  { title: string; description: string }
> = {
  "behavior-psychology": {
    title: "Поведение и психология",
    description: "Диагностика реакций, эмоций и мягкая коррекция поведения.",
  },
  training: {
    title: "Дрессировка и навыки",
    description: "Бытовое послушание, поводок, игра и ежедневные сценарии.",
  },
};

export const LEARNING_TRACK_ORDER: LearningTrackId[] = [
  "behavior-psychology",
  "training",
];

/** Порядок модулей внутри каждого трека (разблокировка и отображение). */
export const TRACK_MODULE_ORDER: Record<LearningTrackId, string[]> = {
  "behavior-psychology": [
    "body-language",
    "greeting-context",
    "owner-emotions",
    "stress-thresholds",
    "calming-signals",
    "fear-desens",
    "reactivity-lat",
    "dog-aggression",
    "puppy",
    "adolescent",
    "enrichment",
    "separation",
    "vet-groom",
  ],
  training: [
    "training-basics",
    "marker-timing-skill",
    "recall-standby",
    "loose-leash",
    "play-boundaries",
    "cooperative-care-skill",
    "reactivity-drills",
  ],
};

const MODULE_TRACK_MAP: Record<string, LearningTrackId> = {
  "body-language": "behavior-psychology",
  "greeting-context": "behavior-psychology",
  "owner-emotions": "behavior-psychology",
  "stress-thresholds": "behavior-psychology",
  "calming-signals": "behavior-psychology",
  "fear-desens": "behavior-psychology",
  "reactivity-lat": "behavior-psychology",
  "dog-aggression": "behavior-psychology",
  puppy: "behavior-psychology",
  adolescent: "behavior-psychology",
  enrichment: "behavior-psychology",
  separation: "behavior-psychology",
  "vet-groom": "behavior-psychology",
  "training-basics": "training",
  "marker-timing-skill": "training",
  "recall-standby": "training",
  "loose-leash": "training",
  "play-boundaries": "training",
  "cooperative-care-skill": "training",
  "reactivity-drills": "training",
};

export function getModule(id: string) {
  return MODULES.find((m) => m.id === id);
}

export function getModuleTrack(moduleId: string): LearningTrackId {
  return MODULE_TRACK_MAP[moduleId] ?? "behavior-psychology";
}

export function getModulesByTrack() {
  const byId = Object.fromEntries(MODULES.map((module) => [module.id, module]));

  return {
    "behavior-psychology": TRACK_MODULE_ORDER["behavior-psychology"]
      .map((id) => byId[id])
      .filter((module): module is Module => Boolean(module)),
    training: TRACK_MODULE_ORDER.training
      .map((id) => byId[id])
      .filter((module): module is Module => Boolean(module)),
  };
}

export function getTrackModuleIndex(moduleId: string) {
  const track = getModuleTrack(moduleId);
  const idx = TRACK_MODULE_ORDER[track].indexOf(moduleId);
  return idx >= 0 ? idx + 1 : 0;
}

export function getQuestion(moduleId: string, questionId: string) {
  const module = getModule(moduleId);
  if (!module) return null;
  return module.questions.find((q) => q.id === questionId) ?? null;
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

export function getPassingScore(module: Module, passPercent = 80) {
  const raw = (module.questions.length * passPercent) / 100;
  return Math.max(1, Math.ceil(raw));
}

export function isModulePassed(
  module: Module,
  score: number,
  maxScore: number,
  passPercent = 80
) {
  const passScore = getPassingScore(module, passPercent);
  return maxScore > 0 && score >= passScore;
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
  return paid;
}

type ProgressLike = {
  moduleId: string;
  score: number;
  maxScore: number;
  passed?: boolean;
};

export function getPassedModuleIds(progress: ProgressLike[]) {
  return progress
    .filter((item) => {
      const module = getModule(item.moduleId);
      if (!module) return false;
      return item.passed ?? isModulePassed(module, item.score, item.maxScore);
    })
    .map((item) => item.moduleId);
}

export type { Module, Question, TheorySection } from "./types";
