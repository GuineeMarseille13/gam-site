"use client";

/* eslint-disable @next/next/no-img-element -- URLs dynamiques (Cloudinary, embeds), tailles variables */
import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { EventMedia } from "@/types/events";
import { useEventMediaPreview } from "@/contexts/event-media-preview-context";
import { EventMediaLightbox } from "@/components/events/event-media-lightbox";

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
            initialIndex={0}
            onClose={() => handleClose()}
          />
        )}
      </AnimatePresence>
    </>
  );
});

EventMediaPreview.displayName = "EventMediaPreview";

export default EventMediaPreview;
