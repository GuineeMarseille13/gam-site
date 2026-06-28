"use client"

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EventMedia } from "@/types/events"
import { useMediaNavigation } from "@/app/(public)/evenements/_hooks/useMediaNavigation"
import {
  CinemaAmbientBackground,
  CinemaHeader,
  CinemaMediaShell,
  CinemaMobileNavBar,
  CinemaNavButton,
  CinemaThumbnailStrip,
  cinemaSlideVariants,
  cinemaThumbClasses,
} from "@/components/lightbox/cinema-lightbox-primitives"
import { cn } from "@/helpers/utils"

export interface EventMediaLightboxProps {
  media: EventMedia[]
  initialIndex?: number
  onClose: (lastIndex: number) => void
}

/**
 * Lightbox plein écran pour la galerie d'un événement (cinéma + vignettes).
 */
export function EventMediaLightbox({
  media,
  initialIndex = 0,
  onClose,
}: EventMediaLightboxProps) {
  const {
    currentIndex,
    currentMedia,
    direction,
    nextMedia,
    prevMedia,
    goToMedia,
  } = useMediaNavigation(media, { initialIndex })

  const thumbnailListRef = useRef<HTMLDivElement>(null)
  const activeThumbRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef(0)

  const hasMultiple = media.length > 1
  const ambientImageUrl = currentMedia?.url ?? null
  const eventTitle = currentMedia?.description ?? null

  const handleClose = useCallback(() => {
    onClose(currentIndex)
  }, [currentIndex, onClose])

  useEffect(() => {
    const container = thumbnailListRef.current
    const active = activeThumbRef.current
    if (!container || !active || !hasMultiple) return

    const containerRect = container.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const scrollLeft =
      container.scrollLeft +
      (activeRect.left - containerRect.left) -
      containerRect.width / 2 +
      activeRect.width / 2

    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: "smooth",
    })
  }, [currentIndex, hasMultiple])

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? 0
  }, [])

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!hasMultiple) return

      const endX = event.changedTouches[0]?.clientX ?? 0
      const diff = touchStartX.current - endX

      if (Math.abs(diff) > 50) {
        if (diff > 0) nextMedia()
        else prevMedia()
      }
    },
    [hasMultiple, nextMedia, prevMedia],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
      if (event.key === "ArrowRight" && hasMultiple) nextMedia()
      if (event.key === "ArrowLeft" && hasMultiple) prevMedia()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleClose, nextMedia, prevMedia, hasMultiple])

  if (!currentMedia) return null

  const isVideoEmbed =
    currentMedia.type === "video" &&
    "embedUrl" in currentMedia &&
    currentMedia.embedUrl
  const isVideoDirect = currentMedia.type === "video" && !isVideoEmbed

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={eventTitle ?? "Galerie de l'événement"}
    >
      <CinemaAmbientBackground imageUrl={ambientImageUrl} />

      <CinemaHeader
        label="Galerie"
        title={eventTitle}
        activeIndex={currentIndex}
        total={media.length}
        onClose={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex min-h-0 w-full flex-1 items-center justify-center px-3 pt-[4.75rem] pb-0 sm:px-8 sm:pt-24 sm:pb-2 md:px-16",
          hasMultiple && "sm:px-16 md:px-20",
        )}
      >
        <CinemaMediaShell>
          <div className="relative w-full" onClick={(event) => event.stopPropagation()}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
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
                className={cn(
                  "relative w-full touch-pan-y overflow-hidden rounded-xl bg-black ring-1 ring-white/10 sm:rounded-3xl",
                  isVideoEmbed || isVideoDirect
                    ? "aspect-video max-h-[min(52vh,78vw)] sm:max-h-[min(70vh,56vw)]"
                    : "max-h-[min(52vh,78vw)] sm:max-h-[min(70vh,56vw)]",
                )}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {currentMedia.type === "video" ? (
                  isVideoEmbed ? (
                    <iframe
                      src={`${currentMedia.embedUrl}?autoplay=1&mute=1`}
                      title="Vidéo intégrée"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={currentMedia.url}
                      className="h-full w-full object-contain"
                      controls
                      autoPlay
                      muted
                      playsInline
                    />
                  )
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={currentMedia.description || `Image ${currentIndex + 1}`}
                    className="mx-auto h-full w-full max-h-[min(52vh,78vw)] object-contain sm:max-h-[min(70vh,56vw)]"
                    draggable={false}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {hasMultiple ? (
              <>
                <CinemaNavButton
                  direction="prev"
                  onClick={prevMedia}
                  className="absolute top-1/2 left-0 z-30 hidden -translate-x-[calc(100%+0.75rem)] -translate-y-1/2 sm:flex"
                />
                <CinemaNavButton
                  direction="next"
                  onClick={nextMedia}
                  className="absolute top-1/2 right-0 z-30 hidden translate-x-[calc(100%+0.75rem)] -translate-y-1/2 sm:flex"
                />
              </>
            ) : null}
          </div>
        </CinemaMediaShell>
      </motion.div>

      {hasMultiple ? (
        <CinemaMobileNavBar
          activeIndex={currentIndex}
          total={media.length}
          onPrev={prevMedia}
          onNext={nextMedia}
        />
      ) : null}

      {hasMultiple ? (
        <CinemaThumbnailStrip listRef={thumbnailListRef}>
          {media.map((item, index) => {
            const isActive = index === currentIndex

            return (
              <button
                key={item.id}
                ref={isActive ? activeThumbRef : undefined}
                type="button"
                onClick={() => goToMedia(index)}
                className={cinemaThumbClasses(isActive)}
                aria-label={`Voir média ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                {item.type === "video" ? (
                  "embedUrl" in item && item.embedUrl ? (
                    <img
                      src={item.url}
                      alt={item.description || `Miniature ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  )
                ) : (
                  <img
                    src={item.url}
                    alt={item.description || `Miniature ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                )}
                {isActive ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-400 via-red-400 to-orange-400" />
                ) : null}
              </button>
            )
          })}
        </CinemaThumbnailStrip>
      ) : null}
    </motion.div>
  )
}
