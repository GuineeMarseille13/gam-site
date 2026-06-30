"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";

const SKELETON_CARD_COUNT = 4;

/**
 * Skeleton section « Nos produits » — même arborescence que `ProductsCircularCarousel`
 * (piste scroll responsive, flèches sm+, barre de contrôle mobile).
 */
export function ProductsSectionSkeleton() {
  return (
    <section
      className="w-full overflow-hidden py-10 sm:py-12"
      role="status"
      aria-busy="true"
      aria-label="Chargement des produits"
    >
      <div className="mb-6 text-center sm:mb-8">
        <PulseBar className="mx-auto mb-4 h-9 max-w-[min(100%,18rem)] rounded-lg sm:h-11 sm:max-w-[22rem] md:h-14 md:max-w-[28rem]" />
        <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <div className="mx-auto mt-4 max-w-3xl space-y-2 px-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <PulseBar className="mx-auto h-4 w-full sm:h-[1.1rem]" />
          <PulseBar className="mx-auto h-4 w-[96%] sm:h-[1.1rem]" />
          <PulseBar className="mx-auto h-4 w-[82%] sm:h-[1.1rem]" />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
        <div className="group/carousel relative">
          <div
            className="pointer-events-none absolute left-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white/90 shadow-lg sm:flex lg:size-12"
            aria-hidden
          >
            <ChevronLeft className="size-6 text-muted-foreground/35" strokeWidth={2} />
          </div>
          <div
            className="pointer-events-none absolute right-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white/90 shadow-lg sm:flex lg:size-12"
            aria-hidden
          >
            <ChevronRight className="size-6 text-muted-foreground/35" strokeWidth={2} />
          </div>

          <div className="overflow-hidden py-4 sm:py-6">
            <div className="flex justify-center gap-6 px-4 sm:gap-8 md:justify-start md:overflow-hidden">
              <div className="w-full max-w-[min(400px,100%)] shrink-0 md:hidden">
                <ProductCardSkeleton className="py-2" />
              </div>
              {Array.from({ length: SKELETON_CARD_COUNT - 1 }).map((_, i) => (
                <div
                  key={i}
                  className="hidden w-[280px] shrink-0 md:block lg:w-[320px] xl:w-[360px]"
                >
                  <ProductCardSkeleton className="py-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4 py-2 sm:hidden" aria-hidden>
            <div className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-border/80 bg-white shadow-md">
              <ChevronLeft className="size-6 text-muted-foreground/40" strokeWidth={2} />
            </div>
            <div className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-border/80 bg-white shadow-md">
              <ChevronRight className="size-6 text-muted-foreground/40" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
