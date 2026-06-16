import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getModule, getResult, scoreModule, isModuleUnlocked } from "@/lib/tests";

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

  const completedIds = user.progress.map((p) => p.moduleId);
  if (!isModuleUnlocked(module, user.paid, completedIds)) {
    return NextResponse.json({ error: "Модуль заблокирован" }, { status: 403 });
  }

  const { score, maxScore } = scoreModule(module, answers);
  const result = getResult(module, score);

  await prisma.testProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId } },
    create: {
      userId: user.id,
      moduleId,
      score,
      maxScore,
      answers: JSON.stringify(answers),
    },
    update: { score, maxScore, answers: JSON.stringify(answers), completedAt: new Date() },
  });

  return NextResponse.json({
    score,
    maxScore,
    percent: Math.round((score / maxScore) * 100),
    result,
    explanations: module.questions.map((q) => ({
      id: q.id,
      text: q.text,
      explanation: q.explanation,
      correctId: q.options.find((o) => o.correct)?.id,
      chosenId: answers[q.id],
    })),
    introCompleted: moduleId === "intro",
    needsPayment: moduleId === "intro" && !user.paid,
  });
}
