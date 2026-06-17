import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModuleMarathon } from "@/components/ModuleMarathon";
import { MODULES } from "@/lib/tests";
import { getCurrentUser } from "@/lib/user";

export default async function MarathonPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const questions = MODULES.flatMap((mod) =>
    mod.questions.map((q) => ({
      ...q,
      id: `${mod.id}-${q.id}`,
      text: `${mod.title}: ${q.text}`,
    }))
  );

  return (
    <div className="mx-auto max-w-xl px-4 pt-[calc(76px+2.5rem)] pb-12">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
        <Link href="/dashboard">← Назад</Link>
      </Button>
      <p className="sk9-eyebrow mb-2">Марафон по всем модулям</p>
      <h1 className="font-h text-2xl font-extrabold uppercase text-charcoal">100 вопросов подряд</h1>
      <p className="mt-2 font-body text-sm text-muted-foreground">
        Тренируйтесь без порядка модулей: вопросы вперемешку из всех тем курса. Можно запускать сколько угодно
        раз.
      </p>

      <div className="mt-8">
        <ModuleMarathon questions={questions} title="Глобальный марафон" />
      </div>
    </div>
  );
}
