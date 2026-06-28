"use client"

/* eslint-disable @next/next/no-img-element */
import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import type { EventMedia } from "@/types/events"
import { useGallerySwipe } from "@/app/(public)/evenements/_hooks/use-gallery-swipe"
import { ANIMATION_CONFIG, MESSAGES, STYLE_CONFIG } from "@/app/(public)/evenements/_config/events.config"
import { cn } from "@/helpers/utils"

interface MediaGalleryStageProps {
  currentMedia: EventMedia
  currentIndex: number
  totalMedia: number
  direction: number
  hasMultipleMedia: boolean
  onPrev: () => void
  onNext: () => void
  canExpand?: boolean
  onExpand?: () => void
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 280 : -280,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 280 : -280,
    opacity: 0,
  }),
}

/**
 * Image / vidéo principale avec navigation, indicateur et swipe mobile.
 */
export const MediaGalleryStage = memo(function MediaGalleryStage({
  currentMedia,
  currentIndex,
  totalMedia,
  direction,
  hasMultipleMedia,
  onPrev,
  onNext,
  canExpand = false,
  onExpand,
}: MediaGalleryStageProps) {
  const { handleTouchStart, handleTouchEnd } = useGallerySwipe({
    enabled: hasMultipleMedia,
    onPrev,
    onNext,
    onTap: canExpand ? onExpand : undefined,
  })

  return (
    <div
      className={cn(
        STYLE_CONFIG.mediaGallery.mediaWrapper,
        hasMultipleMedia && "group/stage",
        canExpand && "cursor-zoom-in sm:cursor-default",
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
                className="h-full w-full object-cover"
              />
            )
          ) : (
            <img
              src={currentMedia.url}
              alt={currentMedia.description || "Photo de l'événement"}
              className="h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {currentMedia.description ? (
        <div className={STYLE_CONFIG.mediaGallery.overlay}>
          <p className={STYLE_CONFIG.mediaGallery.overlayText}>
            {currentMedia.description}
          </p>
        </div>
      ) : null}

      {canExpand ? (
        <div
          className={STYLE_CONFIG.mediaGallery.expandHint}
          aria-hidden
        >
          <ZoomIn className="size-4 text-white" strokeWidth={2} />
          <span>Agrandir</span>
        </div>
      ) : null}

      {hasMultipleMedia ? (
        <>
          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onPrev()
            }}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            whileTap={ANIMATION_CONFIG.mediaGallery.thumbnail.tap}
            className={cn(
              STYLE_CONFIG.mediaGallery.navButton,
              STYLE_CONFIG.mediaGallery.navButtonLeft,
            )}
            aria-label={MESSAGES.media.previous}
          >
            <ChevronLeft className="size-5 sm:size-6 text-slate-700" />
          </motion.button>

          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onNext()
            }}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            whileTap={ANIMATION_CONFIG.mediaGallery.thumbnail.tap}
            className={cn(
              STYLE_CONFIG.mediaGallery.navButton,
              STYLE_CONFIG.mediaGallery.navButtonRight,
            )}
            aria-label={MESSAGES.media.next}
          >
            <ChevronRight className="size-5 sm:size-6 text-slate-700" />
          </motion.button>

          <div className={STYLE_CONFIG.mediaGallery.indicator}>
            <span className="text-xs font-semibold text-white sm:text-sm">
              {currentIndex + 1} / {totalMedia}
            </span>
          </div>
        </>
      ) : null}
    </div>
  )
})
