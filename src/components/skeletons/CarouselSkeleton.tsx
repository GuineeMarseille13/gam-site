"use client";

import { cn } from "@/helpers/utils";

const overlayLine =
  "animate-pulse rounded-md bg-white/20 dark:bg-white/15";

/** Aligné sur `Carousel` : pleine largeur mobile, hauteur responsive, overlay bas, points, badge index. */
export function CarouselSkeleton() {
  return (
    <section
      aria-hidden
      className="relative mx-auto w-[99%] sm:mx-auto sm:w-full sm:max-w-7xl sm:px-6 lg:px-8"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-muted shadow-lg dark:bg-muted/50 sm:shadow-xl",
          "h-[min(58dvh,520px)] min-h-[220px] sm:h-[60vh] md:h-[70vh] lg:h-[75vh]",
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-muted/90 dark:bg-muted/40" />

        <div className="absolute top-3 left-3 z-10 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 backdrop-blur-md sm:top-4 sm:left-4 sm:px-3">
          <div className="h-3.5 w-12 animate-pulse rounded-full bg-white/30 sm:h-4 sm:w-14" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 p-4 pb-14 sm:p-6 sm:pb-16 md:p-8 md:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          <div className="relative space-y-3">
            <div
              className={cn(
                "h-7 max-w-[85%] sm:h-8 sm:max-w-lg md:h-12 md:max-w-2xl",
                overlayLine,
              )}
            />
            <div className="max-w-3xl space-y-2">
              <div className={cn("h-3.5 w-full sm:h-4", overlayLine)} />
              <div className={cn("h-3.5 w-[92%] sm:h-4", overlayLine)} />
              <div className={cn("hidden h-4 w-[70%] md:block", overlayLine)} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 backdrop-blur-md sm:bottom-6 sm:gap-3 sm:px-4 sm:py-2">
          <div className="h-2 w-8 animate-pulse rounded-full bg-white/70 sm:h-4 sm:w-16" />
          <div className="size-2 animate-pulse rounded-full bg-white/45 sm:size-4" />
          <div className="size-2 animate-pulse rounded-full bg-white/45 sm:size-4" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 h-1 bg-white/10">
          <div className="h-full w-[35%] animate-pulse bg-gradient-to-r from-theme-red/90 via-theme-yellow/90 to-theme-green/90" />
        </div>
      </div>
    </section>
  );
}
