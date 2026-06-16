import type { ModuleResult, Question } from "./types";

export function q(
  id: string,
  text: string,
  options: [string, string, string],
  correct: "a" | "b" | "c",
  explanation: string
): Question {
  const [a, b, c] = options;
  return {
    id,
    text,
    options: [
      { id: "a", text: a, correct: correct === "a" },
      { id: "b", text: b, correct: correct === "b" },
      { id: "c", text: c, correct: correct === "c" },
    ],
    explanation,
  };
}

export function tieredResults(
  max: number,
  tiers: [string, string, string[]][]
): ModuleResult[] {
  if (max === 5) {
    return [
      { min: 0, max: 2, title: tiers[0][0], text: tiers[0][1], tips: tiers[0][2] },
      { min: 3, max: 4, title: tiers[1][0], text: tiers[1][1], tips: tiers[1][2] },
      { min: 5, max: 5, title: tiers[2][0], text: tiers[2][1], tips: tiers[2][2] },
    ];
  }
  const mid = Math.floor(max / 2);
  return [
    { min: 0, max: mid - 1, title: tiers[0][0], text: tiers[0][1], tips: tiers[0][2] },
    { min: mid, max: max, title: tiers[1][0], text: tiers[1][1], tips: tiers[1][2] },
  ];
}
