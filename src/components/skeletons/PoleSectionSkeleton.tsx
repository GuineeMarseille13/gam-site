"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

/** Carte alignée sur `PoleCard` : wrapper pt-8 pb-4, carte ~300×420–450px, image h-[280px], corps flex-col + CTA. */
function PoleCardSkeleton() {
  return (
    <div className="overflow-hidden px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6">
      <div
        className="mx-auto flex h-[420px] w-full max-w-[300px] flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08)] sm:h-[450px] sm:w-[280px] md:w-[300px]"
      >
        <div className="h-[280px] w-full shrink-0 animate-pulse bg-muted dark:bg-muted/60" />
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-white to-gray-50/50 p-5 sm:p-6">
          <div className="space-y-2">
            <PulseBar className="h-7 w-[88%] rounded-lg sm:h-8" />
            <PulseBar className="h-4 w-full" />
            <PulseBar className="h-4 w-[92%]" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <PulseBar className="h-4 w-28 rounded-md" />
            <PulseBar className="size-4 shrink-0 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PoleSectionSkeleton() {
  return (
    <section className="w-full overflow-x-hidden bg-gradient-to-b from-white via-gray-50/30 to-white py-5 sm:py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:mb-8 md:mb-10">
          <PulseBar className="mx-auto mb-4 h-9 max-w-[280px] rounded-lg sm:h-11 md:h-12 md:max-w-[340px]" />
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-muted animate-pulse dark:bg-muted/60" />
          <div className="mx-auto max-w-3xl space-y-2">
            <PulseBar className="mx-auto h-4 w-full max-w-2xl sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[90%] max-w-xl sm:h-5" />
          </div>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PoleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
