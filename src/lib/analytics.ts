export const YM_GOALS = {
  REGISTER: "registration",
  ASSESSMENT: "assessment_complete",
  CHECKOUT: "checkout_start",
  PURCHASE: "purchase",
} as const;

type GoalParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

function counterId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YM_COUNTER_ID?.trim();
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function reachGoal(goal: string, params?: GoalParams) {
  const id = counterId();
  if (!id || typeof window === "undefined" || typeof window.ym !== "function") return;
  if (params && Object.keys(params).length > 0) {
    window.ym(id, "reachGoal", goal, params);
    return;
  }
  window.ym(id, "reachGoal", goal);
}

export function trackPageParams(params: GoalParams) {
  const id = counterId();
  if (!id || typeof window === "undefined" || typeof window.ym !== "function") return;
  window.ym(id, "params", params);
}
