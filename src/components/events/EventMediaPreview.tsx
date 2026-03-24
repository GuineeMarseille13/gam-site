"use client";

import { memo, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { EventMedia } from "@/types/events";
import { useMediaNavigation } from "@/app/(public)/evenements/_hooks/useMediaNavigation";
import { useEventMediaPreview } from "@/contexts/event-media-preview-context";

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

  if (!media || media.length === 0) return null;

  const firstMedia = media[0];
  const hasMultiple = media.length > 1;

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setLightboxOpen?.(true);
  }, [setLightboxOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setLightboxOpen?.(false);
  }, [setLightboxOpen]);

  return (
    <>
      {/* Preview : première image, cliquable → lightbox */}
      <button
        type="button"
        className={`group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/50 bg-slate-50/80 text-left cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${ASPECT_MAP[aspectRatio]} ${className}`}
        onClick={handleOpen}
        aria-label={
          hasMultiple
            ? `Voir les ${media.length} média${media.length > 1 ? "x" : ""} de l'événement`
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
              {media.length} média{media.length > 1 ? "x" : ""}
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

  // Scroll automatique pour garder la miniature active visible
  useEffect(() => {
    const container = thumbnailListRef.current;
    const active = activeThumbRef.current;
    if (!container || !active || media.length <= 1) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      (activeRect.left - containerRect.left) -
      containerRect.width / 2 +
      activeRect.width / 2;
    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
  }, [currentIndex, media.length]);

  // Swipe sur mobile pour naviguer
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - endX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextMedia() : prevMedia();
      }
    },
    [nextMedia, prevMedia]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, nextMedia, prevMedia]);

  if (!currentMedia) return null;

  const isVideoEmbed = currentMedia.type === "video" && "embedUrl" in currentMedia && currentMedia.embedUrl;
  const isVideoDirect = currentMedia.type === "video" && !isVideoEmbed;

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 48 : -48,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      x: d < 0 ? 48 : -48,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galerie de l'événement"
    >
      {/* Arrière-plan : bokeh subtil + overlay élégant */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {(currentMedia.type === "image" || (currentMedia.type === "video" && currentMedia.url)) && (
          <div
            className="absolute inset-0 -m-[25%] scale-[1.4] blur-[80px] opacity-40 saturate-150"
            aria-hidden
          >
            <img
              src={currentMedia.url}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950/70" />
      </div>

      {/* Header flottant — design épuré */}
      <div className="absolute top-0 left-0 right-0 z-20 flex shrink-0 items-center justify-between px-4 py-4 sm:px-6 sm:py-5 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/95 backdrop-blur-xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <span className="tabular-nums">{currentIndex + 1}</span>
          <span className="text-white/40 font-normal">/</span>
          <span className="text-white/70">{media.length}</span>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto flex size-10 sm:size-11 cursor-pointer items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
          aria-label="Fermer la galerie"
        >
          <X className="size-5 sm:size-6" strokeWidth={2} />
        </button>
      </div>

      {/* Zone principale : image/vidéo + flèches — clic sur le fond ferme */}
      <div className="relative flex flex-1 min-h-0 w-full items-center justify-center pt-14 sm:pt-16 px-3 pb-2 sm:px-6 md:px-16">
        <div className="relative w-full max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 35 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
              }}
              className={`group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ring-white/10 bg-black/30 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_32px_64px_-12px_rgba(0,0,0,0.5)] touch-pan-y ${
                isVideoEmbed || isVideoDirect
                  ? "aspect-video max-h-[70vh] sm:max-h-[75vh]"
                  : "max-h-[50vh] sm:max-h-[58vh]"
              }`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => e.stopPropagation()}
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
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              )}

              {/* Flèches de navigation — style minimal */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevMedia();
                    }}
                    className="absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-20 md:w-24 flex items-center justify-start pl-2 sm:pl-3 cursor-pointer group/prev bg-gradient-to-r from-black/40 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:opacity-100 touch-manipulation"
                    aria-label="Média précédent"
                  >
                    <span className="flex size-10 sm:size-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-xl border border-white/20 shadow-lg transition-all duration-300 group-hover/prev:bg-white/25 group-hover/prev:scale-110 active:scale-95">
                      <ChevronLeft className="size-5 sm:size-6" strokeWidth={2} />
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextMedia();
                    }}
                    className="absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-20 md:w-24 flex items-center justify-end pr-2 sm:pr-3 cursor-pointer group/next bg-gradient-to-l from-black/40 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:opacity-100 touch-manipulation"
                    aria-label="Média suivant"
                  >
                    <span className="flex size-10 sm:size-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-xl border border-white/20 shadow-lg transition-all duration-300 group-hover/next:bg-white/25 group-hover/next:scale-110 active:scale-95">
                      <ChevronRight className="size-5 sm:size-6" strokeWidth={2} />
                    </span>
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Barre des miniatures — design épuré */}
      {media.length > 1 && (
        <div
          ref={thumbnailListRef}
          onClick={(e) => e.stopPropagation()}
          className="flex shrink-0 overflow-x-auto overflow-y-hidden py-5 sm:py-6 px-4 sm:px-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
        >
          <div className="mx-auto flex w-fit max-w-full justify-center gap-3 sm:gap-4">
            {media.map((m, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={i}
                  ref={isActive ? activeThumbRef : undefined}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToMedia(i);
                  }}
                  className={`relative flex size-16 sm:size-[76px] shrink-0 overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
                    isActive
                      ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-950 scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                      : "ring-2 ring-white/20 hover:ring-white/40 opacity-75 hover:opacity-100"
                  }`}
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
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Description optionnelle */}
      {currentMedia.description && (
        <p className="shrink-0 px-4 pb-5 sm:pb-6 text-center text-sm text-white/60 max-w-2xl mx-auto font-light">
          {currentMedia.description}
        </p>
      )}
    </motion.div>
  );
}

export default EventMediaPreview;
