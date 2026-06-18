"use client";

import { useCallback, useState } from "react";

interface UseGalleryNavigationOptions {
  total: number;
  activeIndex: number;
  onChangeIndex: (index: number) => void;
}

/**
 * Hook: useGalleryNavigation
 * Rôle: Navigation cyclique dans une galerie avec direction pour les animations.
 */
export function useGalleryNavigation({
  total,
  activeIndex,
  onChangeIndex,
}: UseGalleryNavigationOptions) {
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || index < 0 || index >= total) return;
      setDirection(index > activeIndex ? 1 : -1);
      onChangeIndex(index);
    },
    [activeIndex, onChangeIndex, total],
  );

  const goNext = useCallback(() => {
    if (total <= 1) return;
    goTo((activeIndex + 1) % total);
  }, [activeIndex, goTo, total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    goTo((activeIndex - 1 + total) % total);
  }, [activeIndex, goTo, total]);

  return { direction, goTo, goNext, goPrev };
}
