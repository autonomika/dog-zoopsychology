import Link from "next/link";
import {
  LEARNING_TRACK_ORDER,
  LEARNING_TRACKS,
  getModulesByTrack,
  getTrackModuleIndex,
  isModuleUnlocked,
} from "@/lib/tests";
import { Button } from "@/components/ui/button";
import { Lock, BookOpen, Star } from "lucide-react";

type Props = {
  paid: boolean;
  completedIds: string[];
  scores: Record<string, { score: number; maxScore: number; passed?: boolean; passScore?: number }>;
};

export function ModuleList({ paid, completedIds, scores }: Props) {
  const modulesByTrack = getModulesByTrack();

  return (
    <div className="space-y-8">
      {LEARNING_TRACK_ORDER.map((trackId) => {
        const track = LEARNING_TRACKS[trackId];
        const trackModules = modulesByTrack[trackId];

        return (
          <section key={trackId}>
            <div className="mb-3">
              <p className="font-h text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
                Трек обучения
              </p>
              <h3 className="font-h mt-1 text-lg font-extrabold uppercase text-charcoal">
                {track.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{track.description}</p>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {trackModules.map((mod) => {
                const unlocked = isModuleUnlocked(mod, paid, completedIds);
                const done = completedIds.includes(mod.id);
                const score = scores[mod.id];
                const globalIndex = getTrackModuleIndex(mod.id);

                return (
                  <div key={mod.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {globalIndex}. {mod.duration}
                        {mod.free && " · бесплатно"}
                      </p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{mod.title}</p>
                      {mod.recommended && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-sage">
                          <Star className="size-3" />
                          Рекомендуем
                        </span>
                      )}
                    </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <BookOpen className="size-3" />
                        теория + тест
                      </p>
                      {done && score && (
                        <p className="text-xs text-[var(--success)]">
                          тест: {score.score}/{score.maxScore}
                        </p>
                      )}
                      {!done && score && (
                        <p className="text-xs text-[#7b3a34]">
                          нужно закрепить: {score.score}/{score.maxScore}
                          {score.passScore ? ` (порог ${score.passScore})` : ""}
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
          </section>
        );
      })}
    </div>
  );
}
