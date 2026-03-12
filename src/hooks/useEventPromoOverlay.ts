"use client";

import { useState, useEffect, useCallback } from "react";


/**
 * Hook gérant l'affichage de l'overlay événement
 * - Affiche l'overlay une seule fois par session
 * - Ferme au clic extérieur / touche Echap
 */
export function useEventPromoOverlay(delayMs = 800) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  return { isVisible, close };
}
