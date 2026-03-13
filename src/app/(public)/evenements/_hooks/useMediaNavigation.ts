/**
 * Hook personnalisé pour gérer la navigation dans la galerie de médias
 */

import { useState, useCallback } from "react";
import { EventMedia } from "@/types/events";

/**
 * Gère la navigation dans une galerie de médias
 * @param media - Tableau des médias
 * @returns Objet avec l'état et les méthodes de navigation
 */
export function useMediaNavigation(media: EventMedia[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
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

