import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  getModule,
  getPassedModuleIds,
  getPassingScore,
  getResult,
  isModulePassed,
  isModuleUnlocked,
  scoreModule,
} from "@/lib/tests";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Войдите в аккаунт" }, { status: 401 });
  }

  const { moduleId, answers } = await req.json();
  const module = getModule(moduleId);
  if (!module) {
    return NextResponse.json({ error: "Модуль не найден" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { progress: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  const passedIds = getPassedModuleIds(user.progress);
  if (!isModuleUnlocked(module, user.paid, passedIds)) {
    return NextResponse.json({ error: "Модуль заблокирован" }, { status: 403 });
  }

  const { score, maxScore } = scoreModule(module, answers);
  const result = getResult(module, score);
  const passScore = getPassingScore(module);
  const passed = isModulePassed(module, score, maxScore);

  const attempts = module.questions.map((q) => {
    const correctId = q.options.find((o) => o.correct)?.id ?? "";
    const chosenId = answers[q.id] ?? "";
    const isCorrect = chosenId === correctId;
    const reviewAt = !isCorrect
      ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
      : null;
    return { q, correctId, chosenId, isCorrect, reviewAt };
  });

  await prisma.$transaction([
    prisma.testProgress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId } },
      create: {
        userId: user.id,
        moduleId,
        score,
        maxScore,
        passed,
        answers: JSON.stringify(answers),
      },
      update: {
        score,
        maxScore,
        passed,
        answers: JSON.stringify(answers),
        completedAt: new Date(),
      },
    }),
    ...attempts.flatMap((item) =>
      item.isCorrect
        ? [
            prisma.questionAttempt.updateMany({
              where: {
                userId: user.id,
                moduleId,
                questionId: item.q.id,
                reviewed: false,
              },
              data: { reviewed: true },
            }),
          ]
        : [
            prisma.questionAttempt.updateMany({
              where: {
                userId: user.id,
                moduleId,
                questionId: item.q.id,
                reviewed: false,
              },
              data: { reviewed: true },
            }),
            prisma.questionAttempt.create({
              data: {
                userId: user.id,
                moduleId,
                questionId: item.q.id,
                chosenId: item.chosenId,
                correctId: item.correctId,
                isCorrect: false,
                reviewStage: 0,
                nextReviewAt: item.reviewAt,
              },
            }),
          ]
    ),
  ]);

  return NextResponse.json({
    score,
    maxScore,
    percent: Math.round((score / maxScore) * 100),
    passScore,
    passed,
    result,
    explanations: attempts.map((item) => ({
      id: item.q.id,
      text: item.q.text,
      explanation: item.q.explanation,
      correctId: item.correctId,
      chosenId: item.chosenId,
      isCorrect: item.isCorrect,
    })),
    introCompleted: moduleId === "body-language",
    needsPayment: moduleId === "body-language" && !user.paid,
  });
}
