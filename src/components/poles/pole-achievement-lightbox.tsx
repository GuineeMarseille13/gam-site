"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventMediaPreview } from "@/contexts/event-media-preview-context";
import { useGalleryNavigation } from "@/hooks/use-gallery-navigation";
import { getPoleAchievementImageFallback } from "@/helpers/pole-achievement-image";
import { cn } from "@/helpers/utils";
import {
  CinemaAmbientBackground,
  CinemaHeader,
  CinemaMediaShell,
  CinemaNavButton,
  cinemaSlideVariants,
} from "@/components/lightbox/cinema-lightbox-primitives";
import { PoleAchievementLightboxNav } from "./pole-achievement-lightbox-nav";
import { PoleAchievementImage } from "./pole-achievement-image";
import type { PoleAchievementImage as PoleAchievementImageType } from "./pole-achievement.types";

interface PoleAchievementLightboxProps {
  images: PoleAchievementImageType[];
  activeIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

/**
 * Composant: PoleAchievementLightbox
 * Rôle: Affichage plein écran cohérent (style cinéma) pour les réalisations pôle.
 */
export function PoleAchievementLightbox({
  images,
  activeIndex,
  onClose,
  onChangeIndex,
}: PoleAchievementLightboxProps) {
  const { setLightboxOpen } = useEventMediaPreview() ?? {};
  const thumbnailListRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef(0);

  const activeImage = images[activeIndex];
  const hasMultiple = images.length > 1;

  const { direction, goTo, goNext, goPrev } = useGalleryNavigation({
    total: images.length,
    activeIndex,
    onChangeIndex,
  });

  useEffect(() => {
    setLightboxOpen?.(true);
    return () => setLightboxOpen?.(false);
  }, [setLightboxOpen]);

  useEffect(() => {
    const container = thumbnailListRef.current;
    const active = activeThumbRef.current;
    if (!container || !active || !hasMultiple) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      (activeRect.left - containerRect.left) -
      containerRect.width / 2 +
      activeRect.width / 2;

    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
  }, [activeIndex, hasMultiple]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple) goNext();
      if (e.key === "ArrowLeft" && hasMultiple) goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev, hasMultiple]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? 0;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!hasMultiple) return;
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const diff = touchStartX.current - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev, hasMultiple],
  );

  if (!activeImage) return null;

  const imageLabel = activeImage.title || `Réalisation ${activeIndex + 1}`;
  const ambientUrl =
    activeImage.url.startsWith("http://") || activeImage.url.startsWith("https://")
      ? activeImage.url
      : getPoleAchievementImageFallback(imageLabel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={activeImage.title ?? "Réalisation en grand"}
    >
      <CinemaAmbientBackground imageUrl={ambientUrl} />

      <CinemaHeader
        label="Réalisation"
        title={activeImage.title}
        activeIndex={activeIndex}
        total={images.length}
        onClose={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex min-h-0 flex-1 w-full items-center justify-center px-2 pt-14 pb-0 sm:px-6 sm:pt-20 sm:pb-1 md:px-10",
          hasMultiple && "md:px-14",
        )}
      >
        <CinemaMediaShell className="w-full max-w-[min(96vw,1320px)]">
          <div
            className="relative w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${activeImage.url}-${activeIndex}`}
                custom={direction}
                variants={cinemaSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 380, damping: 34 },
                  opacity: { duration: 0.22 },
                  scale: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                }}
                className="relative h-[min(78dvh,calc(100dvh-11rem))] w-full overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10 sm:h-[min(86dvh,calc(100dvh-9rem))] sm:rounded-3xl touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <PoleAchievementImage
                  src={activeImage.url}
                  alt={imageLabel}
                  fill
                  priority
                  className="object-contain p-1 sm:p-2"
                  sizes="(max-width: 768px) 96vw, 1320px"
                />
              </motion.div>
            </AnimatePresence>

            {hasMultiple && (
              <>
                <CinemaNavButton
                  direction="prev"
                  onClick={goPrev}
                  className="absolute top-1/2 left-0 z-30 hidden -translate-x-[calc(100%+0.75rem)] -translate-y-1/2 sm:flex"
                />
                <CinemaNavButton
                  direction="next"
                  onClick={goNext}
                  className="absolute top-1/2 right-0 z-30 hidden translate-x-[calc(100%+0.75rem)] -translate-y-1/2 sm:flex"
                />
              </>
            )}
          </div>
        </CinemaMediaShell>
      </motion.div>

      {activeImage.description && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-auto max-w-2xl shrink-0 px-4 pt-1 pb-2 text-center text-sm leading-relaxed text-white/65 sm:px-6 sm:pb-3"
          onClick={(e) => e.stopPropagation()}
        >
          {activeImage.description}
        </motion.p>
      )}

      <PoleAchievementLightboxNav
        images={images}
        activeIndex={activeIndex}
        listRef={thumbnailListRef}
        activeThumbRef={activeThumbRef}
        onGoTo={goTo}
        onPrev={goPrev}
        onNext={goNext}
      />
    </motion.div>
  );
}
