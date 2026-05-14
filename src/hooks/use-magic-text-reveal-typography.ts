"use client";

import { useCallback, useLayoutEffect, useState } from "react";

export type MagicTextRevealVariant = "hero" | "section" | "display";

/**
 * Paires fontSize / spread pour le canvas MagicTextReveal selon la largeur du viewport.
 *
 * - hero : heros pleine largeur (contacts, page d’accueil section, président, rapports).
 * - section : titres d’onglet de contenu à côté d’icônes (≈ text-2xl → xl:text-6xl Tailwind).
 * - display : ligne de titre unique centrée, alignée sur text-3xl → lg:text-6xl (ex. « équipe »).
 */
export function getMagicTextRevealTypography(
  viewportWidth: number,
  variant: MagicTextRevealVariant,
): { fontSize: number; spread: number } {
  if (variant === "hero") {
    if (viewportWidth < 360) return { fontSize: 20, spread: 15 };
    if (viewportWidth < 400) return { fontSize: 22, spread: 16 };
    if (viewportWidth < 420) return { fontSize: 26, spread: 18 };
    if (viewportWidth < 480) return { fontSize: 30, spread: 19 };
    if (viewportWidth < 640) return { fontSize: 36, spread: 22 };
    if (viewportWidth < 768) return { fontSize: 42, spread: 26 };
    if (viewportWidth < 1024) return { fontSize: 50, spread: 30 };
    return { fontSize: 66, spread: 36 };
  }

  if (variant === "display") {
    if (viewportWidth < 360) return { fontSize: 28, spread: 16 };
    if (viewportWidth < 640) return { fontSize: 30, spread: 17 };
    if (viewportWidth < 768) return { fontSize: 36, spread: 20 };
    if (viewportWidth < 1024) return { fontSize: 48, spread: 26 };
    return { fontSize: 56, spread: 30 };
  }

  /* section — titres longs à côté d’une icône : paliers plus bas < ~520px pour tenir sur une ligne */
  if (viewportWidth < 360) return { fontSize: 18, spread: 10 };
  if (viewportWidth < 420) return { fontSize: 19, spread: 11 };
  if (viewportWidth < 520) return { fontSize: 21, spread: 12 };
  if (viewportWidth < 640) return { fontSize: 24, spread: 14 };
  if (viewportWidth < 768) return { fontSize: 30, spread: 17 };
  if (viewportWidth < 1024) return { fontSize: 36, spread: 20 };
  if (viewportWidth < 1280) return { fontSize: 48, spread: 25 };
  return { fontSize: 54, spread: 28 };
}

const defaultTypography: Record<MagicTextRevealVariant, { fontSize: number; spread: number }> = {
  hero: { fontSize: 52, spread: 32 },
  section: { fontSize: 36, spread: 20 },
  display: { fontSize: 48, spread: 26 },
};

/**
 * Hook: ajuste fontSize et spread du MagicTextReveal au redimensionnement (pattern page contacts).
 *
 * L’état initial est identique SSR / premier rendu client (pas de lecture de `window` dans
 * `useState`) pour éviter les erreurs d’hydratation ; la typo réelle est appliquée dans
 * `useLayoutEffect` avant le peinture.
 */
export function useMagicTextRevealTypography(variant: MagicTextRevealVariant) {
  const [typography, setTypography] = useState(() => defaultTypography[variant]);

  const updateTypography = useCallback(() => {
    setTypography(getMagicTextRevealTypography(window.innerWidth, variant));
  }, [variant]);

  useLayoutEffect(() => {
    updateTypography();
    window.addEventListener("resize", updateTypography);
    return () => window.removeEventListener("resize", updateTypography);
  }, [updateTypography]);

  return typography;
}
