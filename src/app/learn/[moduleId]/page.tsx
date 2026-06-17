import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/user";
import {
  LEARNING_TRACKS,
  getModule,
  getModuleTrack,
  getPassedModuleIds,
  isModuleUnlocked,
} from "@/lib/tests";
import { CourseFlow } from "@/components/CourseFlow";
import { Button } from "@/components/ui/button";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { moduleId } = await params;
  const module = getModule(moduleId);
  if (!module) notFound();
  const track = LEARNING_TRACKS[getModuleTrack(module.id)];

  const passedIds = getPassedModuleIds(user.progress);
  if (!isModuleUnlocked(module, user.paid, passedIds)) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-[calc(76px+5rem)] pb-20 text-center">
        <p className="font-medium">Модуль заблокирован</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Пройдите предыдущие модули или оплатите полный курс.
        </p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard">← Назад</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="sk9-learning-page min-h-[calc(100vh-76px)] pt-[calc(76px+2.5rem)]">
      <div className="mx-auto max-w-xl px-4 pb-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
          <Link href="/dashboard">← Назад</Link>
        </Button>
        <div className="sk9-learning-stage">
          <p className="text-xs text-muted-foreground">
            {module.duration} · теория + тест
            {module.free && " · бесплатно"}
          </p>
          <p className="mt-1 text-xs font-medium text-sage">Трек обучения: {track.title}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{module.title}</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">{module.description}</p>
          <div className="mt-8">
            <CourseFlow module={module} />
          </div>
        </div>
      </div>
    </div>
  );
}
