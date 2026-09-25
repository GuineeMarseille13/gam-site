"use client";

import { useCallback, useEffect, useState } from "react";

export const PROSPECTUS_SLIDE_DELAY_MS = 6500;

export type SlideDirection = 1 | -1;

interface SlidePosition {
  index: number;
  direction: SlideDirection;
}

/**
 * Hook: useProspectusCarousel
 * Rôle: Navigation + auto-avance du carrousel de prospectus (suspendue pendant le survol).
 * Retourne: index courant, direction, état de pause, clé de cycle et actions de navigation.
 */
export function useProspectusCarousel(total: number) {
  const [{ index, direction }, setPosition] = useState<SlidePosition>({ index: 0, direction: 1 });
  const [isPaused, setIsPaused] = useState(false);
  const [resumeCount, setResumeCount] = useState(0);

  const goNext = useCallback(
    () => setPosition((prev) => ({ index: (prev.index + 1) % total, direction: 1 })),
    [total],
  );

  const goPrev = useCallback(
    () => setPosition((prev) => ({ index: (prev.index - 1 + total) % total, direction: -1 })),
    [total],
  );

  const goTo = useCallback(
    (next: number) => setPosition((prev) => ({ index: next, direction: next >= prev.index ? 1 : -1 })),
    [],
  );

  const pause = useCallback(() => setIsPaused(true), []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setResumeCount((count) => count + 1);
  }, []);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setTimeout(goNext, PROSPECTUS_SLIDE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [index, resumeCount, total, isPaused, goNext]);

  return {
    index,
    direction,
    isPaused,
    cycleKey: `${index}-${resumeCount}`,
    goNext,
    goPrev,
    goTo,
    pause,
    resume,
  };
}
