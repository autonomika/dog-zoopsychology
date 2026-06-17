import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReviewTrainer } from "@/components/ReviewTrainer";
import { prisma } from "@/lib/db";
import { getQuestion, getModule } from "@/lib/tests";
import { getSession } from "@/lib/session";

export default async function ReviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dueAttempts = await prisma.questionAttempt.findMany({
    where: {
      userId: session.id,
      reviewed: false,
      nextReviewAt: { lte: new Date() },
    },
    orderBy: [{ nextReviewAt: "asc" }, { createdAt: "asc" }],
    take: 40,
  });

  const items = dueAttempts
    .map((attempt) => {
      const module = getModule(attempt.moduleId);
      const question = getQuestion(attempt.moduleId, attempt.questionId);
      if (!module || !question) return null;
      return {
        attemptId: attempt.id,
        moduleId: attempt.moduleId,
        moduleTitle: module.title,
        questionId: attempt.questionId,
        text: question.text,
        explanation: question.explanation,
        reviewStage: attempt.reviewStage,
        correctId: attempt.correctId,
        options: question.options.map((opt) => ({ id: opt.id, text: opt.text })),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto max-w-xl px-4 pt-[calc(76px+2.5rem)] pb-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
        <Link href="/dashboard">← Назад</Link>
      </Button>
      <p className="sk9-eyebrow mb-2">Повторение</p>
      <h1 className="font-h text-2xl font-extrabold uppercase text-charcoal">
        Интервальный тренажер 1/3/7
      </h1>
      <p className="mt-2 font-body text-sm text-muted-foreground">
        Закрепляйте ошибки по расписанию, чтобы знания переходили в устойчивый навык.
      </p>
      <div className="mt-6">
        <ReviewTrainer items={items} />
      </div>
    </div>
  );
}

