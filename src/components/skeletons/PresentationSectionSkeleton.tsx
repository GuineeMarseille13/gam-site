"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

/** Même shell que `PresentationSection` : fond radial léger, titre « Bienvenue », filet, carte rounded-3xl, badges arrondis en flex-wrap. */
export function PresentationSectionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-blue-50/40 sm:py-6 md:py-8 dark:via-slate-950/80 dark:to-slate-900/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,color-mix(in_srgb,var(--theme-blue)_10%,transparent),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_42%,color-mix(in_srgb,var(--theme-blue)_16%,transparent),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-6 text-center sm:mb-10">
          <PulseBar className="mx-auto mb-5 h-10 max-w-[220px] rounded-lg sm:mb-6 sm:h-12 sm:max-w-[280px] md:h-14 md:max-w-[340px]" />
          <div className="relative mx-auto mt-1 max-w-md sm:max-w-lg">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-2xl dark:via-white/10"
            />
            <div className="relative mx-auto h-[2px] max-w-xs rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_12%,#ffffff_48%,#ffffff_52%,rgba(255,255,255,0.25)_88%,transparent_100%)] opacity-90 shadow-[0_0_20px_rgba(255,255,255,0.25)] sm:max-w-sm dark:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_15%,rgba(255,255,255,0.5)_48%,rgba(255,255,255,0.5)_52%,rgba(255,255,255,0.06)_85%,transparent_100%)]" />
          </div>
        </div>

        <div className="relative rounded-3xl border border-theme-blue/10 bg-gradient-to-br from-white via-blue-50/35 to-white p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-theme-blue/20 dark:via-slate-900/40 dark:to-slate-950 sm:p-8 md:p-10">
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
