"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";
import { cn } from "@/helpers/utils";

const POLE_CARD_COUNT = 3;

/**
 * Carte alignée sur `PoleCard` : cadre dégradé, conteneur blanc interne,
 * image 16/10 mobile / 280px dès sm, texte 3 lignes mobile / 2 lignes sm.
 */
function PoleCardSkeleton() {
  return (
    <div className="w-full px-0 pt-4 pb-3 sm:px-6 sm:pt-10 sm:pb-6">
      <div
        className={cn(
          "relative mx-auto w-full sm:max-w-[300px] sm:w-[280px] md:w-[300px]",
          "h-auto sm:h-[450px]",
          "rounded-2xl",
          "border border-gray-200/60",
          "bg-gradient-to-br from-white via-gray-50 to-white",
          "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.08)]",
        )}
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white">
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-[280px]">
            <div
              aria-hidden
              className="absolute inset-0 animate-pulse bg-muted dark:bg-muted/60"
            />
          </div>

          <div className="flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/50 p-5 sm:flex-1 sm:p-6">
            <div>
              <PulseBar className="mb-2 h-7 w-[85%] rounded-lg sm:mb-3 sm:h-8" />
              <div className="space-y-2">
                <PulseBar className="h-4 w-full rounded-sm sm:h-[1.125rem]" />
                <PulseBar className="h-4 w-[95%] rounded-sm sm:h-[1.125rem]" />
                <PulseBar className="h-4 w-[88%] rounded-sm sm:hidden" />
              </div>
            </div>

            <div className="mt-4 flex min-h-[44px] items-center gap-2">
              <PulseBar className="h-4 w-28 rounded-md" />
              <PulseBar className="size-4 shrink-0 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton section « Nos pôles » — même shell que `PoleSection`. */
export function PoleSectionSkeleton() {
  return (
    <section className="w-full overflow-x-hidden bg-gradient-to-b from-white via-gray-50/30 to-white py-8 sm:py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8 md:mb-10">
          <PulseBar className="mx-auto mb-5 h-9 max-w-[280px] rounded-lg sm:mb-6 sm:h-11 md:h-12 md:max-w-[380px]" />
          <div className="relative mx-auto max-w-md sm:max-w-lg">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-transparent via-violet-100/40 to-transparent blur-2xl dark:via-violet-950/20"
            />
            <div className="relative mx-auto h-[2px] max-w-xs rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_10%,#ffffff_48%,#ffffff_52%,rgba(255,255,255,0.18)_90%,transparent_100%)] opacity-90 shadow-[0_0_20px_rgb(167_139_250_/_0.15)] sm:max-w-sm dark:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_12%,rgba(255,255,255,0.82)_48%,rgba(255,255,255,0.82)_52%,rgba(255,255,255,0.06)_88%,transparent_100%)]" />
          </div>
          <div className="mx-auto mt-3 max-w-3xl space-y-2 px-1 sm:mt-4 sm:px-0">
            <PulseBar className="mx-auto h-4 w-full max-w-2xl sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[88%] max-w-xl sm:h-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:flex sm:items-stretch sm:justify-center sm:gap-4">
          {Array.from({ length: POLE_CARD_COUNT }).map((_, i) => (
            <PoleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
