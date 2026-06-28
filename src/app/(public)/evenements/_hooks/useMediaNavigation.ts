/**
 * Hook personnalisé pour gérer la navigation dans la galerie de médias
 */

import { useState, useCallback, useEffect } from "react";
import { EventMedia } from "@/types/events";

interface UseMediaNavigationOptions {
  initialIndex?: number;
}

/**
 * Gère la navigation dans une galerie de médias
 * @param media - Tableau des médias
 * @returns Objet avec l'état et les méthodes de navigation
 */
export function useMediaNavigation(
  media: EventMedia[],
  options?: UseMediaNavigationOptions,
) {
  const [currentIndex, setCurrentIndex] = useState(options?.initialIndex ?? 0);

  useEffect(() => {
    if (options?.initialIndex === undefined) return;
    setCurrentIndex(options.initialIndex);
  }, [options?.initialIndex]);
  const [direction, setDirection] = useState(0);

  const hasMultipleMedia = media.length > 1;
  const currentMedia = media[currentIndex] || null;
  const totalMedia = media.length;

  const nextMedia = useCallback(() => {
    if (!hasMultipleMedia) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [hasMultipleMedia, media.length]);

  const prevMedia = useCallback(() => {
    if (!hasMultipleMedia) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [hasMultipleMedia, media.length]);

  const goToMedia = useCallback(
    (index: number) => {
      if (index < 0 || index >= media.length) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, media.length]
  );

  return {
    currentIndex,
    currentMedia,
    direction,
    hasMultipleMedia,
    totalMedia,
    nextMedia,
    prevMedia,
    goToMedia,
  };
}

