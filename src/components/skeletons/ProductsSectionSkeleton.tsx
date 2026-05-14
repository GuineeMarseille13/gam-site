"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

const SKELETON_CARD_COUNT = 4;

/**
 * Carte produit — alignée sur `ProductCard` : cadre dégradé ambre/jaune/lime, grande zone image,
 * un titre, description courte, bloc prix + bouton (sans éléments type avatar / témoignage).
 */
function ProductCardSkeleton() {
  return (
    <div className="h-full">
      <div className="h-full rounded-xl bg-gradient-to-br from-amber-200 via-yellow-200 to-lime-200 p-[2px] shadow-lg shadow-amber-100/50 sm:rounded-2xl">
        <div className="flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[10px] bg-white shadow-none sm:min-h-[24rem] sm:rounded-[14px]">
          {/* Zone visuelle type photo produit (pas de cercle / badge type témoignage) */}
          <div className="relative aspect-[34/22] w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-50/90 via-yellow-50/80 to-lime-50/70 sm:aspect-auto sm:h-[200px] lg:h-[220px]">
            <div className="absolute inset-0 animate-pulse bg-muted/45 sm:bg-muted/40" aria-hidden />
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-5">
            <PulseBar className="mb-2 h-5 w-[92%] rounded-md" />
            <div className="mb-4 min-h-[2.5rem] space-y-2">
              <PulseBar className="h-3.5 w-full rounded-sm" />
              <PulseBar className="h-3.5 w-[88%] rounded-sm" />
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <PulseBar className="h-3 w-14 rounded-sm opacity-60" />
                <PulseBar className="h-7 w-24 rounded-md sm:h-8 sm:w-28" />
              </div>
              <div className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-200 via-orange-200 to-amber-200 px-4 py-2.5 shadow-md sm:min-w-[8.5rem]">
                <span className="size-4 shrink-0 rounded bg-white/50" aria-hidden />
                <PulseBar className="h-4 w-20 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton section « Nos produits » — même arborescence que `ProductsCircularCarousel`
 * (en-titre dégradé ambre/jaune/lime, filet `via-primary/35`, sous-titre `max-w-3xl`, piste scroll
 * avec `gap-4 sm:gap-5 lg:gap-6`, flèches sm+, barre de contrôle mobile).
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

      <div className="relative mx-auto max-w-[100rem] px-3 sm:px-6 lg:px-8">
        <div className="group/carousel relative overflow-visible">
          <div
            className="pointer-events-none absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card/90 shadow-lg sm:flex lg:h-12 lg:w-12"
            aria-hidden
          >
            <ChevronLeft className="h-6 w-6 text-muted-foreground/35" strokeWidth={2} />
          </div>
          <div
            className="pointer-events-none absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-card/90 shadow-lg sm:flex lg:h-12 lg:w-12"
            aria-hidden
          >
            <ChevronRight className="h-6 w-6 text-muted-foreground/35" strokeWidth={2} />
          </div>

          <div
            className="touch-pan-y overscroll-x-none snap-x snap-mandatory overflow-x-hidden py-4 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] scroll-px-4 sm:py-5 sm:scroll-px-6 lg:scroll-px-8 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex min-w-max gap-4 pl-6 pr-4 sm:gap-5 sm:pl-8 sm:pr-6 lg:gap-6 lg:pl-10 lg:pr-8">
              {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="w-[340px] shrink-0 snap-start self-stretch sm:w-[280px] md:w-[320px] lg:w-[340px]"
                >
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4 py-2 sm:hidden" aria-hidden>
            <div className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-border/80 bg-card shadow-md">
              <ChevronLeft className="h-6 w-6 text-muted-foreground/40" strokeWidth={2} />
            </div>
            <div className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-border/80 bg-card shadow-md">
              <ChevronRight className="h-6 w-6 text-muted-foreground/40" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
