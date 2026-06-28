"use client"

/* eslint-disable @next/next/no-img-element */
import { memo, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { EventMedia } from "@/types/events"
import { ANIMATION_CONFIG, MESSAGES, STYLE_CONFIG } from "@/app/(public)/evenements/_config/events.config"
import { cn } from "@/helpers/utils"

interface MediaGalleryThumbnailsProps {
  media: EventMedia[]
  currentIndex: number
  galleryId: string
  onSelect: (index: number) => void
}

/**
 * Bande de miniatures scrollable avec snap et centrage de l'élément actif.
 */
export const MediaGalleryThumbnails = memo(function MediaGalleryThumbnails({
  media,
  currentIndex,
  galleryId,
  onSelect,
}: MediaGalleryThumbnailsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const container = listRef.current
    const active = activeRef.current
    if (!container || !active) return

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
  }, [currentIndex])

  return (
    <div className={STYLE_CONFIG.mediaGallery.thumbnailsWrapper}>
      <p className={STYLE_CONFIG.mediaGallery.thumbnailsLabel}>
        {media.length} photo{media.length > 1 ? "s" : ""}
      </p>
      <div ref={listRef} className={STYLE_CONFIG.mediaGallery.thumbnails}>
        {media.map((item, index) => {
          const isActive = index === currentIndex

          return (
            <motion.button
              key={`${galleryId}-${item.id}`}
              ref={isActive ? activeRef : undefined}
              type="button"
              onClick={() => onSelect(index)}
              whileTap={ANIMATION_CONFIG.mediaGallery.thumbnail.tap}
              className={cn(
                STYLE_CONFIG.mediaGallery.thumbnail,
                isActive
                  ? STYLE_CONFIG.mediaGallery.thumbnailActive
                  : STYLE_CONFIG.mediaGallery.thumbnailInactive,
              )}
              aria-label={MESSAGES.media.view(index + 1)}
              aria-current={isActive ? "true" : undefined}
            >
              {item.type === "video" ? (
                "embedUrl" in item && item.embedUrl ? (
                  <img
                    src={item.url}
                    alt={item.description || `Vidéo ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    preload="metadata"
                  />
                )
              ) : (
                <img
                  src={item.url}
                  alt={item.description || `Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}

              {isActive ? (
                <motion.span
                  layoutId={`gallery-active-ring-${galleryId}`}
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-amber-500 ring-offset-2 ring-offset-white"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              ) : null}

              {item.type === "video" ? (
                <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/65">
                  <span className="ml-0.5 size-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-white" />
                </span>
              ) : null}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
})
