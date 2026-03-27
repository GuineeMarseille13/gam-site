"use client";

/* eslint-disable @next/next/no-img-element -- vignettes événements, URLs distantes */
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventMedia } from "@/types/events";
import { useMediaNavigation } from "@/app/(public)/evenements/_hooks/useMediaNavigation";
import { ANIMATION_CONFIG, STYLE_CONFIG, MESSAGES } from "@/app/(public)/evenements/_config/events.config";

interface MediaGalleryProps {
  media: EventMedia[];
  /** ID unique pour les animations de layout (évite les conflits avec plusieurs galeries) */
  galleryId?: string;
}

const MediaGallery = memo(function MediaGallery({
  media,
  galleryId = "gallery",
}: MediaGalleryProps) {
  const {
    currentIndex,
    currentMedia,
    direction,
    nextMedia,
    prevMedia,
    goToMedia,
    hasMultipleMedia,
    totalMedia,
  } = useMediaNavigation(media);

  if (!currentMedia || media.length === 0) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className={STYLE_CONFIG.mediaGallery.container}>
      {/* Media principal avec animation de transition */}
      <div className={STYLE_CONFIG.mediaGallery.mediaWrapper}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: "spring",
                ...ANIMATION_CONFIG.mediaGallery.slide.spring,
              },
              opacity: ANIMATION_CONFIG.mediaGallery.slide.opacity,
            }}
            className="absolute inset-0"
          >
            {currentMedia.type === "video" ? (
              "embedUrl" in currentMedia && currentMedia.embedUrl ? (
                <iframe
                  src={`${currentMedia.embedUrl}?autoplay=1&mute=1`}
                  title="Vidéo intégrée"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={currentMedia.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.description || "Événement"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay avec description amélioré */}
        {currentMedia.description && (
          <motion.div
            {...ANIMATION_CONFIG.mediaGallery.overlay}
            className={STYLE_CONFIG.mediaGallery.overlay}
          >
            <p className="text-white text-xs sm:text-sm font-medium drop-shadow-lg">
              {currentMedia.description}
            </p>
          </motion.div>
        )}

        {/* Navigation améliorée si plusieurs médias */}
        {hasMultipleMedia && (
          <>
            {/* Bouton précédent */}
            <motion.button
              onClick={prevMedia}
              whileHover={ANIMATION_CONFIG.mediaGallery.thumbnail.hover}
              whileTap={ANIMATION_CONFIG.mediaGallery.thumbnail.tap}
              className={`${STYLE_CONFIG.mediaGallery.navButton} ${STYLE_CONFIG.mediaGallery.navButtonLeft}`}
              aria-label={MESSAGES.media.previous}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </motion.button>

            {/* Bouton suivant */}
            <motion.button
              onClick={nextMedia}
              whileHover={ANIMATION_CONFIG.mediaGallery.thumbnail.hover}
              whileTap={ANIMATION_CONFIG.mediaGallery.thumbnail.tap}
              className={`${STYLE_CONFIG.mediaGallery.navButton} ${STYLE_CONFIG.mediaGallery.navButtonRight}`}
              aria-label={MESSAGES.media.next}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </motion.button>

            {/* Indicateur de position amélioré */}
            <motion.div
              {...ANIMATION_CONFIG.mediaGallery.indicator}
              className={STYLE_CONFIG.mediaGallery.indicator}
            >
              <span className="text-white text-xs sm:text-sm font-semibold">
                {currentIndex + 1} / {totalMedia}
              </span>
            </motion.div>
          </>
        )}
      </div>

      {/* Miniatures des médias améliorées (si plusieurs) */}
      {hasMultipleMedia && (
        <div className={STYLE_CONFIG.mediaGallery.thumbnails}>
          {media.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => goToMedia(index)}
              whileHover={ANIMATION_CONFIG.mediaGallery.thumbnail.hover}
              whileTap={ANIMATION_CONFIG.mediaGallery.thumbnail.tap}
              className={`${STYLE_CONFIG.mediaGallery.thumbnail} ${
                index === currentIndex
                  ? STYLE_CONFIG.mediaGallery.thumbnailActive
                  : STYLE_CONFIG.mediaGallery.thumbnailInactive
              }`}
              aria-label={MESSAGES.media.view(index + 1)}
            >
              {item.type === "video" ? (
                "embedUrl" in item && item.embedUrl ? (
                  <img
                    src={item.url}
                    alt={item.description || `Vidéo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                )
              ) : (
                <img
                  src={item.url}
                  alt={item.description || `Média ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              {index === currentIndex && (
                <motion.div
                  layoutId={`activeThumbnail-${galleryId}`}
                  className="absolute inset-0 bg-amber-500/30 border-2 border-amber-500 rounded-lg sm:rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {/* Badge pour les vidéos */}
              {item.type === "video" && (
                <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] sm:border-l-[8px] border-l-white border-t-[4px] sm:border-t-[5px] border-t-transparent border-b-[4px] sm:border-b-[5px] border-b-transparent ml-0.5" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
});

MediaGallery.displayName = "MediaGallery";

export default MediaGallery;

