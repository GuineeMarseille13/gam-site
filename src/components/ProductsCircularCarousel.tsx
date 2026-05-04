"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/app/(public)/boutique/_components/product-card";
import type { Product } from "@/app/(public)/boutique/_schemas/product.schema";

// ============================================================================
// CONFIGURATION
// ============================================================================

const CAROUSEL_CONFIG = {
  autoScrollInterval: 4000,
  cardsPerScroll: 1,
  repositionThreshold: 0.5,
  initializationDelay: 150,
} as const;

const GAP = 20;

// ============================================================================
// TYPES
// ============================================================================

export interface ProductsCircularCarouselProps {
  products: Product[];
  onAdd: (product: Product) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

// ============================================================================
// HOOK: useInfiniteCarousel
// ============================================================================

function useInfiniteCarousel(catalog: Product[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const lastScrollLeftRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  /** Une carte par produit en base (plus de triplication pour effet « infini »). */
  const displayCatalog = catalog.length === 0 ? [] : catalog;

  const getSingleSetWidth = useCallback(() => {
    if (typeof window === "undefined") return 0;

    const container = scrollRef.current;
    if (!container || catalog.length === 0) return 0;

    const flexRow = container.firstElementChild as HTMLElement;
    const firstCard = flexRow?.firstElementChild as HTMLElement;
    if (!firstCard) return 0;

    const itemWidth = firstCard.offsetWidth;
    const computedStyle = window.getComputedStyle(flexRow);
    const gap = parseFloat(computedStyle.gap) || GAP;

    return catalog.length * (itemWidth + gap);
  }, [catalog.length]);

  const getScrollAmount = useCallback(() => {
    const singleSetWidth = getSingleSetWidth();
    if (singleSetWidth === 0) return 0;
    const cardSlotWidth = singleSetWidth / catalog.length;
    return cardSlotWidth * CAROUSEL_CONFIG.cardsPerScroll;
  }, [catalog.length, getSingleSetWidth]);

  const repositionScroll = useCallback(
    (container: HTMLDivElement, newScrollLeft: number) => {
      isScrollingRef.current = true;
      container.style.scrollBehavior = "auto";
      container.scrollLeft = newScrollLeft;

      requestAnimationFrame(() => {
        if (container) {
          container.style.scrollBehavior = "";
          isScrollingRef.current = false;
        }
      });
    },
    []
  );

  useEffect(() => {
    if (!scrollRef.current || catalog.length === 0) return;

    const timeoutId = setTimeout(() => {
      if (scrollRef.current) {
        // Démarrer à 0 pour que la première carte soit totalement visible
        scrollRef.current.scrollLeft = 0;
        lastScrollLeftRef.current = 0;
      }
    }, CAROUSEL_CONFIG.initializationDelay);

    return () => clearTimeout(timeoutId);
  }, [catalog.length, getSingleSetWidth]);

  /**
   * Bloque le défilement utilisateur (molette, trackpad horizontal, Shift+molette).
   * Le déplacement reste possible uniquement via scrollBy (flèches, auto-scroll).
   */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || catalog.length === 0) return;

    const isHorizontalWheelIntent = (e: WheelEvent): boolean => {
      if (e.deltaX !== 0) return true;
      if (e.shiftKey && e.deltaY !== 0) return true;
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isHorizontalWheelIntent(e)) return;
      e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [catalog.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || catalog.length === 0) return;

    const handleScroll = () => {
      if (isScrollingRef.current) {
        lastScrollLeftRef.current = container.scrollLeft;
        return;
      }

      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth === 0) return;

      const scrollLeft = container.scrollLeft;
      const scrollDirection =
        scrollLeft > lastScrollLeftRef.current ? "right" : "left";
      const containerWidth = container.clientWidth;
      const threshold =
        containerWidth * CAROUSEL_CONFIG.repositionThreshold;

      // Défilement circulaire : repositionner en fin de set 2 → début set 2 (même contenu)
      if (scrollLeft >= singleSetWidth * 2 - threshold) {
        repositionScroll(container, scrollLeft - singleSetWidth);
      }
      // Défilement circulaire : repositionner en début de set 2 → fin set 2 (même contenu)
      else if (
        scrollLeft <= singleSetWidth + threshold &&
        scrollDirection === "left"
      ) {
        repositionScroll(container, scrollLeft + singleSetWidth);
      }

      lastScrollLeftRef.current = scrollLeft;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [catalog.length, getSingleSetWidth, repositionScroll]);

  const scrollBy = useCallback((dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount = getScrollAmount();
    if (amount === 0) return;

    container.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, [getScrollAmount]);

  const autoScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isPaused || catalog.length === 0) return;

    const singleSetWidth = getSingleSetWidth();
    if (singleSetWidth === 0) return;

    const currentScroll = container.scrollLeft;
    const scrollAmount = getScrollAmount();
    if (scrollAmount === 0) return;
    const containerWidth = container.clientWidth;
    const threshold =
      containerWidth * CAROUSEL_CONFIG.repositionThreshold;

    if (currentScroll >= singleSetWidth * 2 - threshold) {
      isScrollingRef.current = true;
      container.style.scrollBehavior = "auto";
      container.scrollLeft = currentScroll - singleSetWidth;

      requestAnimationFrame(() => {
        if (container) {
          container.style.scrollBehavior = "";
          requestAnimationFrame(() => {
            if (container && !isPaused) {
              container.scrollBy({ left: scrollAmount, behavior: "smooth" });
              isScrollingRef.current = false;
            }
          });
        }
      });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, [isPaused, catalog.length, getSingleSetWidth, getScrollAmount]);

  useEffect(() => {
    if (catalog.length === 0 || catalog.length <= 1) return;

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      autoScrollIntervalRef.current = setInterval(
        autoScroll,
        CAROUSEL_CONFIG.autoScrollInterval
      );
    };

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [autoScroll, catalog.length]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    if (catalog.length <= 1) return;
    autoScrollIntervalRef.current = setInterval(
      autoScroll,
      CAROUSEL_CONFIG.autoScrollInterval
    );
  }, [autoScroll, catalog.length]);

  return {
    scrollRef,
    displayCatalog,
    scrollBy,
    handleMouseEnter,
    handleMouseLeave,
  };
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export function ProductsCircularCarousel({
  products,
  onAdd,
  title = "Nos Produits",
  subtitle = "Découvrez notre sélection d'articles pour soutenir l'association tout en vous faisant plaisir. Chaque achat contribue directement à nos actions locales et solidaires.",
  className = "",
}: ProductsCircularCarouselProps) {
  const {
    scrollRef,
    displayCatalog,
    scrollBy,
    handleMouseEnter,
    handleMouseLeave,
  } = useInfiniteCarousel(products);

  const productKey = (p: Product, index: number) =>
    `product-${typeof p.id === "string" ? p.id : p.id}-${index}`;

  if (products.length === 0) {
    return (
      <section className={`w-full py-10 sm:py-12 ${className}`}>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl mx-auto px-4">
            Aucun produit à afficher pour le moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-10 sm:py-12 overflow-hidden ${className}`}>
      {/* En-tête */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="mt-3 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary/35 to-transparent rounded-full" />
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
          {subtitle}
        </p>
      </div>

      {/* Carrousel responsive - mobile : contrôles en bas, tablette+ : flèches sur les côtés */}
      <div className="relative max-w-[100rem] mx-auto px-3 sm:px-6 lg:px-8">
        <div
          className="relative group/carousel overflow-visible"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Flèches latérales - masquées sur mobile ; inutiles s'il n'y a qu'un produit */}
          {products.length > 1 && (
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Produits précédents"
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 lg:w-12 lg:h-12 items-center justify-center rounded-full bg-card/95 backdrop-blur-sm shadow-lg border border-border/80 text-primary hover:bg-muted/90 hover:border-primary/35 hover:text-primary transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
          )}

          {/* Zone scrollable - défilement 1 carte, responsive (padding + scroll-padding) */}
          <div
            ref={scrollRef}
            className="overflow-x-hidden touch-pan-y overscroll-x-none snap-x snap-mandatory scroll-smooth py-4 sm:py-5 scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-4 sm:gap-5 lg:gap-6 min-w-max pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8">
              {displayCatalog.map((p, index) => (
                <div
                  key={productKey(p, index)}
                  className="snap-start shrink-0 w-[340px] sm:w-[280px] md:w-[320px] lg:w-[340px] self-stretch"
                >
                  <ProductCard product={p} onAdd={onAdd} />
                </div>
              ))}
            </div>
          </div>

          {products.length > 1 && (
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Produits suivants"
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 lg:w-12 lg:h-12 items-center justify-center rounded-full bg-card/95 backdrop-blur-sm shadow-lg border border-border/80 text-primary hover:bg-muted/90 hover:border-primary/35 hover:text-primary transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={2} />
            </button>
          )}

          {/* Contrôles mobiles - barre en bas, touch-friendly */}
          {products.length > 1 && (
            <div className="sm:hidden flex justify-center gap-4 mt-4 py-2">
              <button
                type="button"
                onClick={() => scrollBy("left")}
                aria-label="Produits précédents"
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-card shadow-md border border-border/80 text-primary transition-colors hover:bg-muted/90 hover:border-primary/35 active:bg-muted"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("right")}
                aria-label="Produits suivants"
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-card shadow-md border border-border/80 text-primary transition-colors hover:bg-muted/90 hover:border-primary/35 active:bg-muted"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
