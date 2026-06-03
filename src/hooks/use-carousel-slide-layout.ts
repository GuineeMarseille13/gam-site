"use client";

import { useLayoutEffect, useRef, useState } from "react";

export interface CarouselSlideLayout {
  trackWidth: number;
  cardWidth: number;
  slidesToShow: number;
  gap: number;
  gutter: number;
  isSingleSlide: boolean;
}

export interface UseCarouselSlideLayoutOptions {
  minCardWidth?: number;
  maxCardWidth?: number;
  gap?: number;
  gutter?: number;
}

const DEFAULTS = {
  minCardWidth: 300,
  gutter: 20,
} as const;

/** Espacement horizontal entre cartes selon la largeur de la piste. */
export function getCarouselGapForTrackWidth(trackWidth: number): number {
  if (trackWidth < 640) return 24;
  if (trackWidth < 1024) return 32;
  return 40;
}

/** Largeur max d’une carte — plus généreuse sur grands écrans. */
export function getCarouselMaxCardForTrackWidth(trackWidth: number): number {
  if (trackWidth < 640) return 400;
  if (trackWidth < 1280) return 400;
  return 420;
}

function getCarouselGutterForTrackWidth(
  trackWidth: number,
  explicitGutter?: number,
): number {
  if (explicitGutter != null) return explicitGutter;
  if (trackWidth < 640) return 16;
  return DEFAULTS.gutter;
}

function computeSlideLayout(
  trackWidth: number,
  options: UseCarouselSlideLayoutOptions,
): CarouselSlideLayout {
  const minCard = options.minCardWidth ?? DEFAULTS.minCardWidth;
  const maxCard =
    options.maxCardWidth ??
    (trackWidth > 0
      ? getCarouselMaxCardForTrackWidth(trackWidth)
      : 400);
  const gutter = getCarouselGutterForTrackWidth(trackWidth, options.gutter);
  const gap =
    options.gap ??
    (trackWidth > 0
      ? getCarouselGapForTrackWidth(trackWidth)
      : 32);

  if (trackWidth <= 0) {
    return {
      trackWidth: 0,
      cardWidth: maxCard,
      slidesToShow: 1,
      gap,
      gutter,
      isSingleSlide: true,
    };
  }

  const innerWidth = trackWidth - 2 * gutter;

  let slides = Math.max(
    1,
    Math.min(8, Math.floor((innerWidth + gap) / (minCard + gap))),
  );

  while (slides > 1) {
    const slotWidth = (innerWidth - gap * (slides - 1)) / slides;
    if (slotWidth >= minCard) break;
    slides -= 1;
  }

  const cardWidth =
    slides === 1
      ? Math.min(maxCard, innerWidth)
      : Math.min(
          maxCard,
          Math.floor((innerWidth - gap * (slides - 1)) / slides),
        );

  return {
    trackWidth,
    cardWidth,
    slidesToShow: slides,
    gap,
    gutter,
    isSingleSlide: slides === 1,
  };
}

const INITIAL_LAYOUT: CarouselSlideLayout = {
  trackWidth: 0,
  cardWidth: 400,
  slidesToShow: 1,
  gap: 32,
  gutter: DEFAULTS.gutter,
  isSingleSlide: true,
};

/**
 * Hook: useCarouselSlideLayout
 * Rôle: Calculer la largeur des cartes pour qu’elles soient entièrement visibles dans la piste.
 */
export function useCarouselSlideLayout(
  options: UseCarouselSlideLayoutOptions = {},
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<CarouselSlideLayout>(INITIAL_LAYOUT);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = (width: number) => {
      setLayout(computeSlideLayout(width, options));
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        update(entry.contentRect.width);
      }
    });

    ro.observe(el);
    update(el.clientWidth);

    return () => ro.disconnect();
  }, [
    options.minCardWidth,
    options.maxCardWidth,
    options.gap,
    options.gutter,
  ]);

  return { trackRef, layout };
}
