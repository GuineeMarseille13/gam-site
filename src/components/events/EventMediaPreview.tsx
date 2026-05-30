"use client";

/* eslint-disable @next/next/no-img-element -- URLs dynamiques (Cloudinary, embeds), tailles variables */
import { memo, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { EventMedia } from "@/types/events";
import { useMediaNavigation } from "@/app/(public)/evenements/_hooks/useMediaNavigation";
import { useEventMediaPreview } from "@/contexts/event-media-preview-context";
import {
  CinemaAmbientBackground,
  CinemaHeader,
  CinemaMediaShell,
  CinemaMobileNavBar,
  CinemaNavButton,
  CinemaThumbnailStrip,
  cinemaSlideVariants,
  cinemaThumbClasses,
} from "@/components/lightbox/cinema-lightbox-primitives";
import { cn } from "@/helpers/utils";

interface EventMediaPreviewProps {
  media: EventMedia[];
  /** Classe CSS additionnelle pour le conteneur */
  className?: string;
  /** Ratio d'aspect du preview (par défaut video = 16/9) */
  aspectRatio?: "video" | "square" | "portrait";
}

const ASPECT_MAP = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
} as const;

/**
 * Affiche la première image d'un événement, cliquable pour ouvrir une lightbox.
 * Si plusieurs images : badge indicateur + overlay au survol.
 */
const EventMediaPreview = memo(function EventMediaPreview({
  media,
  className = "",
  aspectRatio = "video",
}: EventMediaPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLightboxOpen } = useEventMediaPreview() ?? {};

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setLightboxOpen?.(true);
  }, [setLightboxOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setLightboxOpen?.(false);
  }, [setLightboxOpen]);

  if (!media || media.length === 0) return null;

  const firstMedia = media[0];
  const hasMultiple = media.length > 1;

  return (
    <>
      {/* Preview : première image, cliquable → lightbox */}
      <button
        type="button"
        className={`group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/50 bg-slate-50/80 text-left cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${ASPECT_MAP[aspectRatio]} ${className}`}
        onClick={handleOpen}
        aria-label={
          hasMultiple
            ? `Voir les ${media.length} média${media.length > 1 ? "s" : ""} de l'événement`
            : firstMedia.type === "video"
              ? "Voir la vidéo"
              : "Agrandir l'image"
        }
      >
        {firstMedia.type === "video" ? (
          "embedUrl" in firstMedia && firstMedia.embedUrl ? (
            /* YouTube/Vimeo : preview = miniature */
            <img
              src={firstMedia.url}
              alt={firstMedia.description || "Vidéo de l'événement"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <video
              src={firstMedia.url}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              muted
              loop
              playsInline
              poster=""
            />
          )
        ) : (
          <img
            src={firstMedia.url}
            alt={firstMedia.description || "Image de l'événement"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}

        {/* Overlay dégradé au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Badge galerie (si plusieurs) */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-[0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-md border border-white/50">
              <span className="size-2 rounded-full bg-emerald-500" />
              {media.length} média{media.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* CTA au survol */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
          <span className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-5 py-3 text-sm font-medium text-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/80 group-hover:scale-105 transition-transform duration-300">
            <ZoomIn className="size-4.5 text-slate-600" strokeWidth={2} />
            {hasMultiple ? "Voir la galerie" : "Agrandir"}
          </span>
        </div>
      </button>

      {/* Lightbox overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <EventMediaLightbox
            key="lightbox"
            media={media}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
});

EventMediaPreview.displayName = "EventMediaPreview";

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────────────────────

interface EventMediaLightboxProps {
  media: EventMedia[];
  onClose: () => void;
}


function EventMediaLightbox({ media, onClose }: EventMediaLightboxProps) {
  const {
    currentIndex,
    currentMedia,
    direction,
    nextMedia,
    prevMedia,
    goToMedia,
  } = useMediaNavigation(media);
  const thumbnailListRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef(0);

  const hasMultiple = media.length > 1;
  const ambientImageUrl = currentMedia?.url ?? null;
  const eventTitle = currentMedia?.description ?? null;

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
  }, [currentIndex, hasMultiple]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? 0;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!hasMultiple) return;
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const diff = touchStartX.current - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextMedia();
        else prevMedia();
      }
    },
    [hasMultiple, nextMedia, prevMedia],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple) nextMedia();
      if (e.key === "ArrowLeft" && hasMultiple) prevMedia();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, nextMedia, prevMedia, hasMultiple]);

  if (!currentMedia) return null;

  const isVideoEmbed =
    currentMedia.type === "video" &&
    "embedUrl" in currentMedia &&
    currentMedia.embedUrl;
  const isVideoDirect = currentMedia.type === "video" && !isVideoEmbed;

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
      aria-label={eventTitle ?? "Galerie de l'événement"}
    >
      <CinemaAmbientBackground imageUrl={ambientImageUrl} />

      <CinemaHeader
        label="Galerie"
        title={eventTitle}
        activeIndex={currentIndex}
        total={media.length}
        onClose={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex flex-1 min-h-0 w-full items-center justify-center px-3 pb-0 pt-[4.75rem] sm:px-8 sm:pb-2 sm:pt-24 md:px-16",
          hasMultiple && "sm:px-16 md:px-20",
        )}
      >
        <CinemaMediaShell>
          <div
            className="relative w-full"
            onClick={(e) => e.stopPropagation()}
          >
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
                  "relative w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10 sm:rounded-3xl touch-pan-y",
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

            {hasMultiple && (
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
            )}
          </div>
        </CinemaMediaShell>
      </motion.div>

      {hasMultiple && (
        <CinemaMobileNavBar
          activeIndex={currentIndex}
          total={media.length}
          onPrev={prevMedia}
          onNext={nextMedia}
        />
      )}

      {hasMultiple && (
        <CinemaThumbnailStrip listRef={thumbnailListRef}>
          {media.map((m, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={m.id}
                ref={isActive ? activeThumbRef : undefined}
                type="button"
                onClick={() => goToMedia(i)}
                className={cinemaThumbClasses(isActive)}
                aria-label={`Voir média ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                {m.type === "video" ? (
                  "embedUrl" in m && m.embedUrl ? (
                    <img
                      src={m.url}
                      alt={m.description || `Miniature ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <video
                      src={m.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  )
                ) : (
                  <img
                    src={m.url}
                    alt={m.description || `Miniature ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                )}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-400 via-red-400 to-orange-400" />
                )}
              </button>
            );
          })}
        </CinemaThumbnailStrip>
      )}
    </motion.div>
  );
}

export default EventMediaPreview;
