import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { BEHAVIOR_QUESTIONS, scoreBehavior } from "@/lib/behavior-quiz";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Войдите в аккаунт" }, { status: 401 });
  }

  const { dogName, dogBreed, dogAge, answers } = await req.json();

  if (!dogName?.trim()) {
    return NextResponse.json({ error: "Укажите имя собаки" }, { status: 400 });
  }

  for (const q of BEHAVIOR_QUESTIONS) {
    if (!answers?.[q.id]) {
      return NextResponse.json({ error: "Ответьте на все вопросы" }, { status: 400 });
    }
  }

  const result = scoreBehavior(answers);

  await prisma.user.update({
    where: { id: session.id },
    data: {
      dogName: dogName.trim(),
      dogBreed: dogBreed?.trim() || null,
      dogAge: dogAge?.trim() || null,
      behaviorType: result.primaryType.id,
      behaviorScores: JSON.stringify(result.percentages),
    },
  });

  return NextResponse.json({
    ok: true,
    dogName: dogName.trim(),
    primaryType: result.primaryType,
    percentages: result.percentages,
    allTypes: result.allTypes,
  });
}
