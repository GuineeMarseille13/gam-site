"use client";

import { cn } from "@/helpers/utils";
const overlayLine =
  "animate-pulse rounded-md bg-white/20 dark:bg-white/15";

/** Aligné sur `Carousel` : h-[60vh] md:h-[70vh] lg:h-[75vh], overlay bas, points, badge index, piste fine. */
export function CarouselSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-muted dark:bg-muted/50",
          "h-[60vh] md:h-[70vh] lg:h-[75vh]",
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-muted/90 dark:bg-muted/40" />

        <div className="absolute top-4 left-4 z-10 rounded-full border border-white/20 bg-black/20 px-3 py-1 backdrop-blur-md">
          <div className="h-4 w-14 animate-pulse rounded-full bg-white/30" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          <div className="relative space-y-3">
            <div
              className={cn(
                "h-8 max-w-lg sm:h-10 md:h-12 md:max-w-2xl",
                overlayLine,
              )}
            />
            <div className="max-w-3xl space-y-2">
              <div className={cn("h-4 w-full", overlayLine)} />
              <div className={cn("h-4 w-[92%]", overlayLine)} />
              <div className={cn("hidden h-4 w-[70%] md:block", overlayLine)} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 space-x-3 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
          <div className="h-4 w-16 animate-pulse rounded-full bg-white/70" />
          <div className="size-4 animate-pulse rounded-full bg-white/45" />
          <div className="size-4 animate-pulse rounded-full bg-white/45" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 h-1 bg-white/10">
          <div className="h-full w-[35%] animate-pulse bg-gradient-to-r from-theme-red/90 via-theme-yellow/90 to-theme-green/90" />
        </div>
      </div>
    </div>
  );
}
