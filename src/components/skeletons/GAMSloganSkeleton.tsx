"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

/** Aligné sur `GAMSlogan` : bloc titre ~h-[70px], paragraphe, ligne « Suivez-nous », pastilles sociales. */
export function GAMSloganSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100/80 to-stone-100 py-8 text-gray-800 backdrop-blur-sm md:py-10 dark:from-muted/30 dark:via-muted/20 dark:to-muted/40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30 dark:to-black/50" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mb-6 flex justify-center md:mb-8">
          <div className="flex h-[70px] w-full max-w-xl items-center justify-center">
            <PulseBar className="h-12 w-full max-w-md rounded-xl sm:h-14 md:h-16" />
          </div>
        </div>

        <div className="mx-auto mb-6 max-w-2xl space-y-2 md:mb-8">
          <PulseBar className="mx-auto h-5 w-full md:h-6" />
          <PulseBar className="mx-auto h-5 w-[88%] md:h-6" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <PulseBar className="h-4 w-36 rounded-md" />
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <PulseBar
                key={i}
                className="size-10 rounded-full shadow-md md:size-12"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
