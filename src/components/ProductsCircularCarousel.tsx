"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/app/(public)/boutique/_components/product-card";
import type { Product } from "@/app/(public)/boutique/_schemas/product.schema";
import { SectionSplitHeading } from "@/components/section-split-heading";
import { useCarouselSlideLayout } from "@/hooks/use-carousel-slide-layout";
import {
  buildLoopedCatalog,
  useInfiniteHorizontalCarousel,
} from "@/hooks/use-infinite-horizontal-carousel";

const PRODUCTS_INTRO =
  "Découvrez notre sélection d\u2019articles pour soutenir l\u2019association tout en vous faisant plaisir. Chaque achat contribue directement à nos actions locales et solidaires.";

/** Largeurs cartes produits : une carte entièrement visible sur mobile, plusieurs sur grand écran. */
const PRODUCT_CAROUSEL_LAYOUT = {
  minCardWidth: 280,
  maxCardWidth: 400,
} as const;

export interface ProductsCircularCarouselProps {
  products: Product[];
  onAdd: (product: Product) => void;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Section d'accueil : produits en carrousel horizontal infini (défilement circulaire).
 * Même moteur que `PartnersCarousel` (layout responsive + boucle + auto-scroll).
 */
export function ProductsCircularCarousel({
  products,
  onAdd,
  autoPlay = true,
  interval = 4000,
  showArrows = true,
  title = "Nos Produits",
  subtitle = PRODUCTS_INTRO,
  className = "",
}: ProductsCircularCarouselProps) {
  const safeProducts = products?.length > 0 ? products : [];
  const totalProducts = safeProducts.length;

  const { trackRef, layout } = useCarouselSlideLayout(PRODUCT_CAROUSEL_LAYOUT);

  const canScroll = totalProducts > layout.slidesToShow;
  const displayProducts = canScroll
    ? buildLoopedCatalog(safeProducts)
    : safeProducts;
  const showControls = showArrows && canScroll;

  const { scrollRef, scrollBy, handleMouseEnter, handleMouseLeave, isLoopEnabled } =
    useInfiniteHorizontalCarousel(totalProducts, {
      autoScrollInterval: autoPlay && canScroll ? interval : 0,
      defaultGap: layout.gap,
      enabled: canScroll,
    });

  const setScrollTrackRef = (node: HTMLDivElement | null) => {
    trackRef.current = node;
    scrollRef.current = node;
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isLoopEnabled || layout.cardWidth <= 0) return;

    const singleSetWidth = totalProducts * (layout.cardWidth + layout.gap);

    container.scrollLeft = singleSetWidth;
  }, [
    layout.cardWidth,
    layout.gap,
    totalProducts,
    isLoopEnabled,
    scrollRef,
  ]);

  if (totalProducts === 0) {
    return (
      <section className={`w-full py-10 sm:py-12 ${className}`}>
        <div className="mb-6 text-center sm:mb-8">
          <SectionSplitHeading showAmbient={false} title={title} tone="shop" />
          <p className="mx-auto mt-3 max-w-3xl px-4 text-base text-muted-foreground sm:mt-4 sm:text-lg">
            Aucun produit à afficher pour le moment.
          </p>
        </div>
      </section>
    );
  }

  const productKey = (product: Product, index: number) =>
    `product-${typeof product.id === "string" ? product.id : product.id}-${index}`;

  const snapClass = layout.isSingleSlide ? "snap-center" : "snap-start";

  return (
    <section className={`w-full overflow-hidden py-10 sm:py-12 ${className}`}>
      <div className="mb-6 text-center sm:mb-8">
        <SectionSplitHeading showAmbient={false} title={title} tone="shop" />
        <p className="mx-auto mt-3 max-w-3xl px-4 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
          {subtitle}
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
        <div
          className="group/carousel relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {showControls ? (
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Produits précédents"
              className="absolute left-2 top-1/2 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white/95 text-primary shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:border-primary/35 hover:bg-muted/90 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex lg:size-12"
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </button>
          ) : null}

          <div
            ref={setScrollTrackRef}
            className="overflow-x-auto touch-pan-y overscroll-x-contain snap-x snap-mandatory scroll-smooth py-4 sm:py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              scrollPaddingInline: `${layout.gutter}px`,
            }}
            {...(isLoopEnabled
              ? { "aria-roledescription": "carousel" as const }
              : {})}
          >
            <div
              className={`flex min-w-max ${canScroll ? "" : "w-full justify-center"}`}
              style={{
                gap: layout.gap,
                paddingInline: layout.gutter,
              }}
            >
              {displayProducts.map((product, index) => (
                <div
                  key={productKey(product, index)}
                  className={`box-border shrink-0 grow-0 self-stretch py-2 ${snapClass}`}
                  style={{
                    width: layout.cardWidth,
                    minWidth: layout.cardWidth,
                    maxWidth: layout.cardWidth,
                  }}
                >
                  <ProductCard product={product} onAdd={onAdd} />
                </div>
              ))}
            </div>
          </div>

          {showControls ? (
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Produits suivants"
              className="absolute right-2 top-1/2 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-white/95 text-primary shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:border-primary/35 hover:bg-muted/90 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex lg:size-12"
            >
              <ChevronRight className="size-6" strokeWidth={2} />
            </button>
          ) : null}

          {showControls ? (
            <div className="mt-4 flex justify-center gap-4 py-2 sm:hidden">
              <button
                type="button"
                onClick={() => scrollBy("left")}
                aria-label="Produits précédents"
                className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-border/80 bg-white text-primary shadow-md transition-colors hover:bg-muted/90 active:bg-muted"
              >
                <ChevronLeft className="size-6" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("right")}
                aria-label="Produits suivants"
                className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-border/80 bg-white text-primary shadow-md transition-colors hover:bg-muted/90 active:bg-muted"
              >
                <ChevronRight className="size-6" strokeWidth={2} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
