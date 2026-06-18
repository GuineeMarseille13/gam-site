"use client";

import type { RefObject } from "react";
import {
  CinemaMobileNavBar,
  CinemaThumbnailStrip,
  cinemaThumbClasses,
} from "@/components/lightbox/cinema-lightbox-primitives";
import { PoleAchievementImage } from "./pole-achievement-image";
import type { PoleAchievementImage as PoleAchievementImageType } from "./pole-achievement.types";

interface PoleAchievementLightboxNavProps {
  images: PoleAchievementImageType[];
  activeIndex: number;
  listRef: RefObject<HTMLDivElement | null>;
  activeThumbRef: RefObject<HTMLButtonElement | null>;
  onGoTo: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Composant: PoleAchievementLightboxNav
 * Rôle: Barre de navigation mobile + bandeau de miniatures du lightbox réalisations.
 */
export function PoleAchievementLightboxNav({
  images,
  activeIndex,
  listRef,
  activeThumbRef,
  onGoTo,
  onPrev,
  onNext,
}: PoleAchievementLightboxNavProps) {
  if (images.length <= 1) return null;

  return (
    <>
      <CinemaMobileNavBar
        activeIndex={activeIndex}
        total={images.length}
        onPrev={onPrev}
        onNext={onNext}
      />

      <CinemaThumbnailStrip listRef={listRef}>
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          const label = image.title ?? `Réalisation ${index + 1}`;

          return (
            <button
              key={`${image.url}-${index}`}
              ref={isActive ? activeThumbRef : undefined}
              type="button"
              onClick={() => onGoTo(index)}
              className={cinemaThumbClasses(isActive)}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
            >
              <PoleAchievementImage
                src={image.url}
                alt={label}
                fill
                className="object-cover"
                sizes="80px"
              />
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
              )}
            </button>
          );
        })}
      </CinemaThumbnailStrip>
    </>
  );
}
