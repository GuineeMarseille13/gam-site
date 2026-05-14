"use client";

import { cn } from "@/helpers/utils";
import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useIsMobile";

const STAT_BORDER_CLASSES = [
  "border-theme-red/20 shadow-theme-red/10",
  "border-theme-yellow/20 shadow-theme-yellow/10",
  "border-theme-green/20 shadow-theme-green/10",
  "border-theme-blue/20 shadow-theme-blue/10",
] as const;

const STAT_GRADIENT_BG = [
  "bg-gradient-red",
  "bg-gradient-yellow",
  "bg-gradient-green",
  "bg-gradient-blue",
] as const;

const SKELETON_CARD_COUNT = 4;

/**
 * Carte — même gabarit que `StatisticCard` : `h-24`, `border-2`, overlay dégradé ~10 %,
 * `CardContent` : **[ chiffre large | libellé + icône ]** avec `space-x-3`.
 */
function StatisticCardSkeleton({ index }: { index: number }) {
  const borderClass = STAT_BORDER_CLASSES[index % STAT_BORDER_CLASSES.length];
  const gradClass = STAT_GRADIENT_BG[index % STAT_GRADIENT_BG.length];

  return (
    <Card
      className={cn(
        "relative h-24 overflow-hidden border-2 bg-card/95 shadow-sm dark:bg-card",
        borderClass,
      )}
    >
      <div
        className={cn("pointer-events-none absolute inset-0 opacity-10", gradClass)}
        aria-hidden
      />

      <CardContent className="relative z-10 flex h-full min-w-0 items-center justify-center p-4">
        <div className="mr-4 shrink-0">
          <PulseBar className="h-10 w-14 rounded-md md:h-12 md:w-16 lg:h-14 lg:w-[4.25rem]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center space-x-3">
          <div className="min-w-0 flex-1">
            <PulseBar className="h-4 w-full max-w-[200px] md:h-[1.125rem]" />
          </div>
          <PulseBar className="size-8 shrink-0 rounded-md md:size-10" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton « Nos Réalisations » — aligné sur `StatisticsSection` :
 * `py-10 md:py-12 px-4`, overlay, `container`, titre dégradé, sous-titre `max-w-2xl`,
 * grille `flex flex-wrap justify-center gap-4 md:gap-6 sm:gap-5 max-w-6xl`, `flex-col` + `w-full` sur mobile.
 */
export function StatisticsSectionSkeleton() {
  const isMobile = useIsMobile();

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10 md:py-12"
      role="status"
      aria-busy="true"
      aria-label="Chargement des réalisations"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-theme-overlay opacity-30" />

      <div className="container relative mx-auto">
        <div className="mb-8 text-center md:mb-10">
          <div
            className="mx-auto mb-4 h-10 max-w-[min(100%,20rem)] animate-pulse rounded-lg bg-gradient-to-r from-red-200/80 via-yellow-200/75 to-green-200/80 sm:h-12 md:h-14 md:max-w-[24rem]"
            aria-hidden
          />
          <PulseBar className="mx-auto h-7 max-w-2xl rounded-md md:h-8" />
        </div>

        <div
          className={cn(
            "mx-auto flex max-w-6xl flex-wrap justify-center gap-4 md:gap-6 sm:gap-5",
            isMobile && "flex-col",
          )}
        >
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              className={cn("min-w-0 shrink-0", isMobile ? "w-full" : "")}
            >
              <StatisticCardSkeleton index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
