"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface InfiniteHorizontalCarouselConfig {
  autoScrollInterval?: number;
  cardsPerScroll?: number;
  repositionThreshold?: number;
  initializationDelay?: number;
  defaultGap?: number;
  /** Active la boucle infinie (désactivé si toutes les cartes tiennent dans la piste). */
  enabled?: boolean;
}

const DEFAULT_CONFIG: Required<InfiniteHorizontalCarouselConfig> = {
  enabled: true,
  autoScrollInterval: 4000,
  cardsPerScroll: 1,
  repositionThreshold: 0.5,
  initializationDelay: 150,
  defaultGap: 24,
};

/**
 * Hook: useInfiniteHorizontalCarousel
 * Rôle: Défilement horizontal infini (3 jeux d’items + reposition au scroll).
 */
export function useInfiniteHorizontalCarousel(
  itemCount: number,
  options: InfiniteHorizontalCarouselConfig = {},
) {
  const config = { ...DEFAULT_CONFIG, ...options };
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const isScrollingRef = useRef(false);
  const lastScrollLeftRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const isLoopEnabled =
    (options.enabled ?? itemCount > 1) && itemCount > 0;

  const getSingleSetWidth = useCallback(() => {
    if (typeof window === "undefined" || itemCount === 0) return 0;

    const container = scrollRef.current;
    if (!container) return 0;

    const flexRow = container.firstElementChild as HTMLElement | null;
    const firstCard = flexRow?.firstElementChild as HTMLElement | null;
    if (!firstCard || !flexRow) return 0;

    const itemWidth = firstCard.offsetWidth;
    const computedStyle = window.getComputedStyle(flexRow);
    const gap =
      parseFloat(computedStyle.gap) || config.defaultGap;

    return itemCount * (itemWidth + gap);
  }, [itemCount, config.defaultGap]);

  const getScrollAmount = useCallback(() => {
    const singleSetWidth = getSingleSetWidth();
    if (singleSetWidth === 0 || itemCount === 0) return 0;
    const cardSlotWidth = singleSetWidth / itemCount;
    return cardSlotWidth * config.cardsPerScroll;
  }, [itemCount, getSingleSetWidth, config.cardsPerScroll]);

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
    [],
  );

  useEffect(() => {
    if (!scrollRef.current || !isLoopEnabled) return;

    const timeoutId = setTimeout(() => {
      const container = scrollRef.current;
      if (!container) return;

      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth === 0) return;

      container.scrollLeft = singleSetWidth;
      lastScrollLeftRef.current = singleSetWidth;
    }, config.initializationDelay);

    return () => clearTimeout(timeoutId);
  }, [isLoopEnabled, itemCount, getSingleSetWidth, config.initializationDelay]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isLoopEnabled) return;

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
  }, [isLoopEnabled]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isLoopEnabled) return;

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
        containerWidth * config.repositionThreshold;

      if (scrollLeft >= singleSetWidth * 2 - threshold) {
        repositionScroll(container, scrollLeft - singleSetWidth);
      } else if (
        scrollLeft <= singleSetWidth + threshold &&
        scrollDirection === "left"
      ) {
        repositionScroll(container, scrollLeft + singleSetWidth);
      }

      lastScrollLeftRef.current = scrollLeft;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    isLoopEnabled,
    itemCount,
    getSingleSetWidth,
    repositionScroll,
    config.repositionThreshold,
  ]);

  const scrollBy = useCallback(
    (dir: "left" | "right") => {
      const container = scrollRef.current;
      if (!container) return;

      const amount = getScrollAmount();
      if (amount === 0) return;

      container.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    },
    [getScrollAmount],
  );

  const autoScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isPaused || !isLoopEnabled) return;

    const singleSetWidth = getSingleSetWidth();
    if (singleSetWidth === 0) return;

    const currentScroll = container.scrollLeft;
    const scrollAmount = getScrollAmount();
    if (scrollAmount === 0) return;

    const containerWidth = container.clientWidth;
    const threshold =
      containerWidth * config.repositionThreshold;

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
  }, [
    isPaused,
    isLoopEnabled,
    getSingleSetWidth,
    getScrollAmount,
    config.repositionThreshold,
  ]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    if (
      !isLoopEnabled ||
      isPaused ||
      config.autoScrollInterval <= 0
    ) {
      return;
    }

    autoScrollIntervalRef.current = setInterval(
      autoScroll,
      config.autoScrollInterval,
    );
  }, [
    autoScroll,
    isLoopEnabled,
    isPaused,
    stopAutoScroll,
    config.autoScrollInterval,
  ]);

  useEffect(() => {
    if (config.autoScrollInterval <= 0) return;
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll, stopAutoScroll, config.autoScrollInterval]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    stopAutoScroll();
  }, [stopAutoScroll]);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    startAutoScroll();
  }, [startAutoScroll]);

  return {
    scrollRef,
    scrollBy,
    handleMouseEnter,
    handleMouseLeave,
    isLoopEnabled,
  };
}

/** Triple le catalogue pour permettre la boucle infinie sans saut visible. */
export function buildLoopedCatalog<T>(items: T[]): T[] {
  if (items.length === 0) return [];
  if (items.length === 1) return items;
  return [...items, ...items, ...items];
}
