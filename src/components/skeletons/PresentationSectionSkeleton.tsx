"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

/** Même shell que `PresentationSection` : fond radial léger, titre « Bienvenue », filet, carte rounded-3xl, badges arrondis en flex-wrap. */
export function PresentationSectionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white sm:py-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-center sm:mb-8">
          <PulseBar className="mx-auto mb-4 h-9 max-w-[200px] rounded-lg sm:h-11 sm:max-w-[260px] md:h-14 md:max-w-[320px]" />
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-muted animate-pulse dark:bg-muted/60" />
        </div>

        <div className="relative rounded-3xl border border-gray-200/60 bg-gradient-to-br from-white via-gray-50/80 to-white p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:p-8 md:p-10">
          <div className="mx-auto max-w-4xl space-y-3 text-center sm:space-y-4">
            <PulseBar className="mx-auto h-4 w-full max-w-3xl sm:h-5" />
            <PulseBar className="mx-auto h-4 w-full max-w-3xl sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[94%] max-w-2xl sm:h-5" />
            <PulseBar className="mx-auto hidden h-4 w-[88%] max-w-xl sm:block sm:h-5" />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-10 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-muted/30 px-4 py-2.5 sm:gap-3 sm:px-5 sm:py-3"
              >
                <PulseBar className="size-4 shrink-0 rounded-full sm:size-5" />
                <PulseBar className="h-4 w-28 rounded-full sm:w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
