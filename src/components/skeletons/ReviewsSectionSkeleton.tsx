"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIAL_CARD_SIZE_CLASS } from "@/components/testimonial-card";

/** Carte alignée sur `TestimonialCard` — mêmes dimensions fixes. */
function TestimonialCardSkeleton() {
  return (
    <Card className={`${TESTIMONIAL_CARD_SIZE_CLASS} border-2 border-border/70 bg-card shadow-md`}>
      <CardContent className="flex h-full flex-col p-5">
        <div className="mb-3 flex shrink-0 items-start gap-3">
          <PulseBar className="size-12 shrink-0 rounded-full border-2 border-transparent" />
          <div className="min-w-0 flex-1 space-y-2">
            <PulseBar className="h-4 w-36 max-w-full" />
            <PulseBar className="h-3 w-24" />
            <PulseBar className="mt-1 h-3.5 w-8 rounded-sm" />
          </div>
        </div>
        <div className="mt-auto space-y-0">
          <PulseBar className="h-[30px] w-full rounded-sm" />
          <PulseBar className="mt-0 h-[30px] w-20 rounded-sm" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Deux bandeaux horizontaux (mobile + desktop) + fades latéraux. */
export function ReviewsSectionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white py-10 md:py-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-10">
          <PulseBar className="mx-auto mb-3 h-10 max-w-[min(100%,28rem)] rounded-lg sm:h-12 md:h-14" />
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-muted animate-pulse dark:bg-muted/60" />
          <div className="mx-auto max-w-2xl space-y-2">
            <PulseBar className="mx-auto h-4 w-full sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[92%] sm:h-5" />
          </div>
        </div>

        <div className="relative -mx-4 sm:mx-0">
          <div className="mb-3 flex gap-3 overflow-hidden md:mb-4 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <TestimonialCardSkeleton key={`a-${i}`} />
            ))}
          </div>
          <div className="flex gap-3 overflow-hidden md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <TestimonialCardSkeleton key={`b-${i}`} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-16 md:w-1/4 md:via-white/85 dark:from-background dark:via-background/90" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-16 md:w-1/4 md:via-white/85 dark:from-background dark:via-background/90" />
        </div>
      </div>
    </section>
  );
}
