import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { ModuleList } from "@/components/ModuleList";
import { LogoutButton } from "@/components/LogoutButton";
import { PurchaseButton } from "@/components/PurchaseButton";
import { MODULES } from "@/lib/tests";
import { BEHAVIOR_TYPES, type BehaviorTypeId } from "@/lib/behavior-quiz";
import Link from "next/link";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.behaviorType) redirect("/assessment");

  const params = await searchParams;
  const paidBanner = params.paid === "1";
  const price = process.env.NEXT_PUBLIC_COURSE_PRICE || "1990";

  const completedIds = user.progress.map((p) => p.moduleId);
  const scores = Object.fromEntries(
    user.progress.map((p) => [p.moduleId, { score: p.score, maxScore: p.maxScore }])
  );
  const doneCount = completedIds.length;
  const total = MODULES.length;
  const percent = Math.round((doneCount / total) * 100);

  const behavior =
    user.behaviorType && user.behaviorType in BEHAVIOR_TYPES
      ? BEHAVIOR_TYPES[user.behaviorType as BehaviorTypeId]
      : null;

  return (
    <div className="mx-auto max-w-xl px-4 pt-[calc(76px+2.5rem)] pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="sk9-eyebrow mb-2">Мой курс</p>
          <h1 className="font-h text-2xl font-extrabold uppercase text-charcoal">{user.name}</h1>
          {user.dogName && (
            <p className="font-sub mt-1 text-sm italic text-muted-foreground">
              {user.dogName}
              {user.dogBreed ? ` · ${user.dogBreed}` : ""}
              {user.dogAge ? ` · ${user.dogAge}` : ""}
            </p>
          )}
          <p className="mt-2 font-body text-sm text-muted-foreground">
            {doneCount}/{total} модулей · {percent}%
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-6 h-1.5 bg-stone">
        <div className="h-full bg-sage transition-all" style={{ width: `${percent}%` }} />
      </div>

      {paidBanner && user.paid && (
        <p className="mt-4 font-body text-sm text-[var(--success)]">
          Оплата прошла. Все модули открыты.
        </p>
      )}

      {params.paid === "pending" && !user.paid && (
        <p className="mt-4 font-body text-sm text-muted-foreground">
          Ожидаем подтверждение оплаты. Обновите страницу через минуту.
        </p>
      )}

      {params.paid === "0" && !user.paid && (
        <p className="mt-4 font-body text-sm text-destructive">Оплата не завершена.</p>
      )}

      {behavior && (
        <div className="mt-8 border-t-[3px] border-sage bg-paper p-5">
          <p className="font-h text-[10px] font-bold uppercase tracking-[0.16em] text-sage">
            Тип поведения
          </p>
          <p className="font-h mt-1 text-xl font-extrabold uppercase text-charcoal">
            {behavior.title}
          </p>
          <p className="font-body mt-2 text-sm text-[#5a5a52]">{behavior.short}</p>
          <Link
            href="/assessment?retake=1"
            className="mt-3 inline-block font-h text-[11px] font-bold uppercase tracking-wider text-sage hover:text-deep-moss"
          >
            Пересдать тест →
          </Link>
        </div>
      )}

      {!user.paid && completedIds.includes("intro") && (
        <div className="mt-8 space-y-3 border border-stone bg-[#fefefe] p-5">
          <p className="font-body text-sm">Откройте полный курс — {price} ₽, разово</p>
          <PurchaseButton />
        </div>
      )}

      <div className="mt-10">
        <p className="font-h mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Модули
        </p>
        <ModuleList paid={user.paid} completedIds={completedIds} scores={scores} />
      </div>
    </div>
  );
}
