"use client";

import { AnimatePresence } from "motion/react";

import { ProspectusFooter } from "./prospectus-footer";
import { ProspectusProgress } from "./prospectus-progress";
import { ProspectusSlide } from "./prospectus-slide";
import { useProspectusCarousel } from "./use-prospectus-carousel";

interface ProspectusCarouselProps {
  imageIds: string[];
  onClose: () => void;
}

/**
 * Composant: ProspectusCarousel
 * Rôle: Carrousel de prospectus dans un cadre aux proportions fixes (format A4 portrait) ;
 * chaque image est affichée en intégralité, quelles que soient ses dimensions.
 * Dépendances: useProspectusCarousel, ProspectusSlide, ProspectusProgress, ProspectusFooter
 */
export function ProspectusCarousel({ imageIds, onClose }: ProspectusCarouselProps) {
  const total = imageIds.length;
  const carousel = useProspectusCarousel(total);
  const currentId = imageIds[carousel.index];

  if (!currentId) {
    return <p className="flex h-64 items-center justify-center text-sm text-gray-400">Aucune image</p>;
  }

  const hasProgress = total > 1;

  return (
    <div className="flex flex-col" onMouseEnter={carousel.pause} onMouseLeave={carousel.resume}>
      <div className="relative aspect-[5/7] w-full overflow-hidden bg-gray-950">
        {hasProgress && (
          <ProspectusProgress
            total={total}
            index={carousel.index}
            isPaused={carousel.isPaused}
            cycleKey={carousel.cycleKey}
          />
        )}

        <AnimatePresence custom={carousel.direction} initial={false}>
          <ProspectusSlide
            key={carousel.index}
            imageId={currentId}
            alt={`Prospectus ${carousel.index + 1} sur ${total}`}
            direction={carousel.direction}
            hasProgress={hasProgress}
          />
        </AnimatePresence>
      </div>

      <ProspectusFooter
        total={total}
        index={carousel.index}
        onPrev={carousel.goPrev}
        onNext={carousel.goNext}
        onSelect={carousel.goTo}
        onClose={onClose}
      />
    </div>
  );
}
