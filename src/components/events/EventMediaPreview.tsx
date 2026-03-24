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
        className={`group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/40 bg-slate-100 text-left cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-slate-300/50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${ASPECT_MAP[aspectRatio]} ${className}`}
        onClick={handleOpen}
        aria-label={
          hasMultiple
            ? `Voir les ${media.length} photos de l'événement`
            : "Agrandir l'image"
        }
      >
        {firstMedia.type === "video" ? (
          <video
            src={firstMedia.url}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            muted
            loop
            playsInline
            poster=""
          />
        ) : (
          <img
            src={firstMedia.url}
            alt={firstMedia.description || "Image de l'événement"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}

        {/* Overlay dégradé au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Badge galerie (si plusieurs) */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {media.length} photo{media.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* CTA au survol */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-xl ring-1 ring-slate-200/50">
            <ZoomIn className="size-4 text-slate-600" />
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

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galerie d'images de l'événement"
    >
      {/* Arrière-plan : image floutée dynamique + overlay sombre (effet style Photos/Spotify) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {currentMedia.type === "image" && (
          <div
            className="absolute inset-0 -m-[20%] scale-[1.8] blur-[60px] opacity-35"
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
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80" />
      </div>

      {/* Header flottant (glassmorphism) */}
      <div className="absolute top-0 left-0 right-0 z-20 flex shrink-0 items-center justify-between px-3 py-3 sm:px-6 sm:py-4 pointer-events-none">
        <div className="pointer-events-auto rounded-full bg-black/20 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl border border-white/10">
          {currentIndex + 1} <span className="text-white/50">/ {media.length}</span>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto flex size-10 sm:size-11 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-xl border border-white/10 transition-all duration-200 hover:bg-black/30 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Fermer la galerie"
        >
          <X className="size-5 sm:size-6" />
        </button>
      </div>

      {/* Zone principale : image + flèches — clic sur le fond ferme */}
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
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.15 },
              }}
              className="relative max-h-[50vh] sm:max-h-[58vh] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_25px_80px_-12px_rgba(0,0,0,0.6)] touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {currentMedia.type === "video" ? (
                <video
                  src={currentMedia.url}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.description || `Image ${currentIndex + 1}`}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              )}

              {/* Flèches intégrées sur l'image (position moderne type galerie) */}
              {media.length > 1 && (
                <>
                  {/* Zone cliquable gauche — prev (toujours visible mobile, au survol desktop) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevMedia();
                    }}
                    className="absolute left-0 top-0 bottom-0 z-10 w-14 sm:w-16 md:w-20 flex items-center justify-start pl-2 sm:pl-3 cursor-pointer group/prev bg-gradient-to-r from-black/50 via-black/20 to-transparent md:opacity-60 md:hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:opacity-100 touch-manipulation"
                    aria-label="Image précédente"
                  >
                    <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 transition-all duration-200 group-hover/prev:bg-white/25 group-hover/prev:scale-105 active:scale-95">
                      <ChevronLeft className="size-5" strokeWidth={2.5} />
                    </span>
                  </button>
                  {/* Zone cliquable droite — next */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextMedia();
                    }}
                    className="absolute right-0 top-0 bottom-0 z-10 w-14 sm:w-16 md:w-20 flex items-center justify-end pr-2 sm:pr-3 cursor-pointer group/next bg-gradient-to-l from-black/50 via-black/20 to-transparent md:opacity-60 md:hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:opacity-100 touch-manipulation"
                    aria-label="Image suivante"
                  >
                    <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 transition-all duration-200 group-hover/next:bg-white/25 group-hover/next:scale-105 active:scale-95">
                      <ChevronRight className="size-5" strokeWidth={2.5} />
                    </span>
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Barre des miniatures (glassmorphism moderne) */}
      {media.length > 1 && (
        <div
          ref={thumbnailListRef}
          onClick={(e) => e.stopPropagation()}
          className="flex shrink-0 overflow-x-auto overflow-y-hidden py-4 sm:py-5 px-4 sm:px-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
        >
          <div className="mx-auto flex w-fit max-w-full justify-center gap-2 sm:gap-3">
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
                  className={`relative flex size-14 sm:size-[72px] shrink-0 overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    isActive
                      ? "border-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.3)] scale-105 opacity-100"
                      : "border-white/15 hover:border-white/30 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`Voir image ${i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {m.type === "video" ? (
                    <video
                      src={m.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
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
        <p className="shrink-0 px-4 pb-4 sm:pb-6 text-center text-sm text-white/70 max-w-2xl mx-auto">
          {currentMedia.description}
        </p>
      )}
    </motion.div>
  );
}

export default EventMediaPreview;
