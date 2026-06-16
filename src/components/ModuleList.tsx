import Link from "next/link";
import { MODULES, isModuleUnlocked } from "@/lib/tests";
import { Button } from "@/components/ui/button";
import { Lock, BookOpen } from "lucide-react";

type Props = {
  paid: boolean;
  completedIds: string[];
  scores: Record<string, { score: number; maxScore: number }>;
};

export function ModuleList({ paid, completedIds, scores }: Props) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {MODULES.map((mod, i) => {
        const unlocked = isModuleUnlocked(mod, paid, completedIds);
        const done = completedIds.includes(mod.id);
        const score = scores[mod.id];

        return (
          <div key={mod.id} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {i + 1}. {mod.duration}
                {mod.free && " · бесплатно"}
              </p>
              <p className="font-medium">{mod.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="size-3" />
                теория + тест
              </p>
              {done && score && (
                <p className="text-xs text-[var(--success)]">
                  тест: {score.score}/{score.maxScore}
                </p>
              )}
            </div>
            {!unlocked ? (
              <Lock className="size-4 shrink-0 text-muted-foreground" />
            ) : done ? (
              <Button asChild variant="ghost" size="sm">
                <Link href={`/learn/${mod.id}`}>Повторить</Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href={`/learn/${mod.id}`}>Изучить</Link>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
