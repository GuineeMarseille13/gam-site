"use client";

import { memo, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { EventMedia } from "@/types/events";
import { useMediaNavigation } from "@/app/(public)/evenements/_hooks/useMediaNavigation";
import { STYLE_CONFIG } from "@/app/(public)/evenements/_config/events.config";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useEventMediaPreview } from "@/contexts/event-media-preview-context";
import { MediaGalleryStage } from "@/components/events/media-gallery-stage";
import { MediaGalleryThumbnails } from "@/components/events/media-gallery-thumbnails";
import { EventMediaLightbox } from "@/components/events/event-media-lightbox";

interface MediaGalleryProps {
  media: EventMedia[];
  /** ID unique pour les animations de layout (évite les conflits avec plusieurs galeries) */
  galleryId?: string;
}

/**
 * Galerie inline d'un événement : image principale + miniatures + lightbox mobile.
 */
const MediaGallery = memo(function MediaGallery({
  media,
  galleryId = "gallery",
}: MediaGalleryProps) {
  const isMobile = useIsMobile();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { setLightboxOpen } = useEventMediaPreview() ?? {};

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

  const handleOpenLightbox = useCallback(() => {
    if (!isMobile) return;
    setIsLightboxOpen(true);
    setLightboxOpen?.(true);
  }, [isMobile, setLightboxOpen]);

  const handleCloseLightbox = useCallback(
    (lastIndex: number) => {
      goToMedia(lastIndex);
      setIsLightboxOpen(false);
      setLightboxOpen?.(false);
    },
    [goToMedia, setLightboxOpen],
  );

  if (!currentMedia || media.length === 0) return null;

  return (
    <>
      <div className={STYLE_CONFIG.mediaGallery.container}>
        <MediaGalleryStage
          currentMedia={currentMedia}
          currentIndex={currentIndex}
          totalMedia={totalMedia}
          direction={direction}
          hasMultipleMedia={hasMultipleMedia}
          onPrev={prevMedia}
          onNext={nextMedia}
          canExpand={isMobile}
          onExpand={handleOpenLightbox}
        />

        {hasMultipleMedia ? (
          <MediaGalleryThumbnails
            media={media}
            currentIndex={currentIndex}
            galleryId={galleryId}
            onSelect={goToMedia}
          />
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        {isLightboxOpen ? (
          <EventMediaLightbox
            key={`${galleryId}-${currentIndex}`}
            media={media}
            initialIndex={currentIndex}
            onClose={handleCloseLightbox}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
});

MediaGallery.displayName = "MediaGallery";

export default MediaGallery;
