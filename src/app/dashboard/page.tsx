import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { ModuleList } from "@/components/ModuleList";
import { LogoutButton } from "@/components/LogoutButton";
import { PaymentGoalTracker } from "@/components/PaymentGoalTracker";
import { PurchaseButton } from "@/components/PurchaseButton";
import { Button } from "@/components/ui/button";
import { MODULES, getPassedModuleIds, getPassingScore } from "@/lib/tests";
import { BEHAVIOR_TYPES, type BehaviorTypeId } from "@/lib/behavior-quiz";
import { prisma } from "@/lib/db";
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

  const completedIds = getPassedModuleIds(user.progress);
  const scores = Object.fromEntries(
    user.progress.map((p) => {
      const module = MODULES.find((m) => m.id === p.moduleId);
      const passScore = module ? getPassingScore(module) : p.maxScore;
      return [p.moduleId, { score: p.score, maxScore: p.maxScore, passed: p.passed, passScore }];
    })
  );
  const doneCount = completedIds.length;
  const total = MODULES.length;
  const totalQuestions = MODULES.reduce((acc, m) => acc + m.questions.length, 0);
  const percent = Math.round((doneCount / total) * 100);

  const behavior =
    user.behaviorType && user.behaviorType in BEHAVIOR_TYPES
      ? BEHAVIOR_TYPES[user.behaviorType as BehaviorTypeId]
      : null;

  const weakRows = await prisma.questionAttempt.groupBy({
    by: ["moduleId"],
    where: { userId: user.id, isCorrect: false },
    _count: { _all: true },
  });

  const weakTopics = weakRows
    .map((row) => ({
      moduleId: row.moduleId,
      mistakes: row._count._all,
      module: MODULES.find((m) => m.id === row.moduleId),
    }))
    .filter((row) => row.module)
    .sort((a, b) => b.mistakes - a.mistakes)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-xl px-4 pt-[calc(76px+2.5rem)] pb-10">
      <PaymentGoalTracker paid={paidBanner && user.paid} />
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

      <div className="mt-6 rounded-lg border border-sage/30 bg-[linear-gradient(180deg,#f8faf5_0%,#f2f6ef_100%)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-h text-[11px] font-bold uppercase tracking-[0.14em] text-sage">Тренажер</p>
            <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">Глобальный марафон</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalQuestions} вопросов из всех {total} модулей вперемешку. Без очередности, можно перезапускать.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/marathon">Запустить</Link>
          </Button>
        </div>
      </div>

      {!user.paid && (
        <div className="mt-6 space-y-3 rounded-lg border border-sage/30 bg-[linear-gradient(180deg,#f8faf5_0%,#f2f6ef_100%)] p-5">
          <p className="font-h text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
            Полный доступ к курсу
          </p>
          <p className="font-body text-sm text-charcoal">
            Откройте все {total} модулей в обоих треках обучения — {price} ₽, разово, без подписки.
          </p>
          <p className="text-xs text-muted-foreground">
            Первый модуль бесплатный. После оплаты открываются все тесты, теория и тренажеры.
          </p>
          <PurchaseButton />
        </div>
      )}

      {user._count?.attempts ? (
        <div className="mt-4 rounded-lg border border-sage/25 bg-[linear-gradient(180deg,#f8faf5_0%,#f2f6ef_100%)] p-4">
          <p className="text-sm text-charcoal">
            Сегодня к повторению: <span className="font-semibold text-sage">{user._count.attempts}</span>
          </p>
          <Button asChild size="sm" className="mt-3">
            <Link href="/review">Запустить интервальный тренажер</Link>
          </Button>
        </div>
      ) : null}

      {weakTopics.length > 0 ? (
        <div className="mt-4 rounded-lg border border-stone/70 bg-[#fefefe] p-4">
          <p className="text-sm font-medium text-charcoal">Зоны роста (по частоте ошибок)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Это не провал — это ваши точки максимального прогресса.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[#5a5a52]">
            {weakTopics.map((topic) => (
              <li key={topic.moduleId} className="flex items-start justify-between gap-3">
                <span>{topic.module?.title}</span>
                <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-xs text-charcoal">
                  ошибок: {topic.mistakes}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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


      <div className="mt-10">
        <p className="font-h mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Треки обучения и тесты
        </p>
        <ModuleList paid={user.paid} completedIds={completedIds} scores={scores} />
      </div>
    </div>
  );
}
