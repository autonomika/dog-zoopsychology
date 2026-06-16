import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

/** Демо-разблокировка без ЮKassa (только для разработки) */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Недоступно" }, { status: 403 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Войдите в аккаунт" }, { status: 401 });
  }

  await prisma.user.update({ where: { id: session.id }, data: { paid: true } });
  return NextResponse.json({ ok: true });
}
