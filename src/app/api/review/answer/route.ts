import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const DAY_MS = 24 * 60 * 60 * 1000;

function nextIntervalDays(stage: number) {
  if (stage <= 0) return 3;
  if (stage === 1) return 7;
  return null;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Войдите в аккаунт" }, { status: 401 });
  }

  const { attemptId, chosenId } = await req.json();
  if (typeof attemptId !== "string" || typeof chosenId !== "string") {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const attempt = await prisma.questionAttempt.findUnique({
    where: { id: attemptId },
  });
  if (!attempt || attempt.userId !== session.id || attempt.reviewed) {
    return NextResponse.json({ error: "Попытка не найдена" }, { status: 404 });
  }

  const isCorrect = chosenId === attempt.correctId;
  if (!isCorrect) {
    const tomorrow = new Date(Date.now() + DAY_MS);
    const updated = await prisma.questionAttempt.update({
      where: { id: attempt.id },
      data: {
        chosenId,
        isCorrect: false,
        reviewStage: 0,
        nextReviewAt: tomorrow,
        reviewed: false,
      },
    });
    return NextResponse.json({
      ok: true,
      isCorrect: false,
      done: false,
      nextReviewAt: updated.nextReviewAt,
      nextInDays: 1,
    });
  }

  const days = nextIntervalDays(attempt.reviewStage);
  if (days === null) {
    await prisma.questionAttempt.update({
      where: { id: attempt.id },
      data: {
        chosenId,
        isCorrect: true,
        reviewed: true,
        nextReviewAt: null,
      },
    });
    return NextResponse.json({ ok: true, isCorrect: true, done: true });
  }

  const nextReviewAt = new Date(Date.now() + days * DAY_MS);
  await prisma.questionAttempt.update({
    where: { id: attempt.id },
    data: {
      chosenId,
      isCorrect: true,
      reviewStage: attempt.reviewStage + 1,
      nextReviewAt,
      reviewed: false,
    },
  });

  return NextResponse.json({
    ok: true,
    isCorrect: true,
    done: false,
    nextReviewAt,
    nextInDays: days,
  });
}

