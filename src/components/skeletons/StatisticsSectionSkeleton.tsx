"use client";

import { cn } from "@/helpers/utils";
import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";
import { Card, CardContent } from "@/components/ui/card";

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

function StatisticCardSkeleton({ index }: { index: number }) {
  const borderClass = STAT_BORDER_CLASSES[index % STAT_BORDER_CLASSES.length];
  const gradClass = STAT_GRADIENT_BG[index % STAT_GRADIENT_BG.length];

  return (
    <Card
      className={cn(
        "relative w-full gap-0 overflow-hidden border-2 bg-card/95 py-0 shadow-sm dark:bg-card",
        "sm:h-24 sm:gap-6 sm:py-6",
        borderClass,
      )}
    >
      <div
        className={cn("pointer-events-none absolute inset-0 opacity-10", gradClass)}
        aria-hidden
      />

      <CardContent className="relative z-10 grid w-full min-w-0 grid-cols-[3rem_1fr_auto] items-center gap-x-2.5 px-3.5 py-3 sm:flex sm:h-full sm:items-center sm:justify-center sm:gap-0 sm:p-4">
        <PulseBar className="h-8 w-10 shrink-0 rounded-md sm:mr-4 sm:h-10 sm:w-14 md:h-12 md:w-16" />
        <PulseBar className="h-[15px] w-full rounded-sm sm:h-4 sm:max-w-[200px] md:h-[1.125rem]" />
        <PulseBar className="size-7 shrink-0 rounded-md sm:ml-3 sm:size-8 md:size-10" />
      </CardContent>
    </Card>
  );
}

export function StatisticsSectionSkeleton() {
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

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-4 md:gap-6 lg:gap-5">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
            <div key={i} className="min-w-0 w-full sm:w-auto sm:shrink-0">
              <StatisticCardSkeleton index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
