"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { SECTION_SPLIT_TONE_STYLES } from "@/components/section-split-heading-tones";
import { cn } from "@/helpers/utils";

const BOUTIQUE_SKELETON_CARD_COUNT = 6;

const BOUTIQUE_PAGE_SHELL =
  "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8";

/**
 * Hero aligné sur `ShopView` : titre magic slider, filet shop, sous-titre.
 */
function BoutiqueHeroSkeleton() {
  const palette = SECTION_SPLIT_TONE_STYLES.shop;

  return (
    <div className="mb-10 w-full min-w-0 text-center sm:mb-12">
      <div className="flex w-full min-w-0 justify-center px-1 sm:px-2">
        <PulseBar className="h-14 w-[min(100%,20rem)] rounded-2xl sm:h-16 sm:w-96" />
      </div>

      <div className="relative mx-auto mt-2 max-w-md pb-0.5 sm:mt-3 sm:max-w-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-2xl dark:via-white/12"
        />
        <div aria-hidden className={palette.separatorVeil} />
        <div
          aria-hidden
          className={cn(
            palette.separatorBar,
            palette.separatorShadow,
            palette.separatorShadowDark,
          )}
        />
      </div>

      <PulseBar className="mx-auto mt-2 h-5 w-[min(100%,20rem)] rounded-md sm:mt-3 sm:h-6 sm:w-96" />
    </div>
  );
}

/**
 * Grille produits — même disposition que `ShopView` (1 / 2 / 3 colonnes).
 */
export function BoutiqueProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: BOUTIQUE_SKELETON_CARD_COUNT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton page boutique — même shell que `ShopView` (hero + grille produits).
 */
export function BoutiqueSkeleton() {
  return (
    <div
      className={BOUTIQUE_PAGE_SHELL}
      role="status"
      aria-busy="true"
      aria-label="Chargement de la boutique"
    >
      <BoutiqueHeroSkeleton />
      <BoutiqueProductsGridSkeleton />
    </div>
  );
}
