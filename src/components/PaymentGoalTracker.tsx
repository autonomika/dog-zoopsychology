"use client";

import { useEffect } from "react";
import { reachGoal, YM_GOALS } from "@/lib/analytics";

const STORAGE_KEY = "zoopsy_purchase_tracked";

export function PaymentGoalTracker({ paid }: { paid: boolean }) {
  useEffect(() => {
    if (!paid) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    reachGoal(YM_GOALS.PURCHASE);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, [paid]);

  return null;
}
