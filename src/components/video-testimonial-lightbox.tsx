"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import type { VideoTestimonial } from "@/app/_services/home";
import {
  buildTestimonialEmbedUrl,
  getVideoThumbnailUrl,
  parseVideoUrl,
} from "@/helpers/video-urls";
import { cn } from "@/helpers/utils";
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

interface VideoTestimonialLightboxProps {
  videos: VideoTestimonial[];
  activeIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

function TestimonialEmbedPlayer({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const parsed = parseVideoUrl(url);

  useEffect(() => {
    setIsLoading(true);
  }, [url]);

  if (!parsed) {
    return (
      <video
        src={url}
        controls
        autoPlay
        playsInline
        onLoadedData={() => setIsLoading(false)}
        className="absolute inset-0 h-full w-full object-contain bg-black"
      />
    );
  }

  const embedUrl =
    typeof window !== "undefined"
      ? buildTestimonialEmbedUrl(url, window.location.origin)
      : buildTestimonialEmbedUrl(url);

  return (
    <>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-950/80"
        >
          <Loader2 className="size-10 animate-spin text-white/70" aria-hidden />
          <span className="sr-only">Chargement de la vidéo…</span>
        </motion.div>
      )}
      <iframe
        key={url}
        src={embedUrl}
        title="Témoignage vidéo"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}

/**
 * Lightbox cinéma pour les témoignages vidéo — fond ambiant, navigation fluide.
 */
export function VideoTestimonialLightbox({
  videos,
  activeIndex,
  onClose,
  onChangeIndex,
}: VideoTestimonialLightboxProps) {
  const [direction, setDirection] = useState(0);
  const thumbnailListRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef(0);

  const activeVideo = videos[activeIndex];
  const ambientThumb = activeVideo
    ? getVideoThumbnailUrl(activeVideo.url, activeVideo.thumbnail)
    : null;

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setDirection(index > activeIndex ? 1 : -1);
      onChangeIndex(index);
    },
    [activeIndex, onChangeIndex],
  );

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % videos.length);
  }, [activeIndex, goTo, videos.length]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + videos.length) % videos.length);
  }, [activeIndex, goTo, videos.length]);

  useEffect(() => {
    const container = thumbnailListRef.current;
    const active = activeThumbRef.current;
    if (!container || !active || videos.length <= 1) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      (activeRect.left - containerRect.left) -
      containerRect.width / 2 +
      activeRect.width / 2;
    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
  }, [activeIndex, videos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && videos.length > 1) goNext();
      if (e.key === "ArrowLeft" && videos.length > 1) goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev, videos.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? 0;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (videos.length <= 1) return;
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const diff = touchStartX.current - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev, videos.length],
  );

  if (!activeVideo) return null;

  const hasMultiple = videos.length > 1;

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
      aria-label={activeVideo.title ?? "Lecteur témoignage vidéo"}
    >
      <CinemaAmbientBackground imageUrl={ambientThumb} />

      <CinemaHeader
        label="Témoignage"
        title={activeVideo.title}
        activeIndex={activeIndex}
        total={videos.length}
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
                key={activeVideo.id}
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
                className="relative aspect-video w-full max-h-[min(52vh,78vw)] overflow-hidden rounded-xl bg-black ring-1 ring-white/10 sm:max-h-[min(70vh,56vw)] sm:rounded-3xl touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <TestimonialEmbedPlayer url={activeVideo.url} />
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

      {hasMultiple && (
        <CinemaMobileNavBar
          activeIndex={activeIndex}
          total={videos.length}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {activeVideo.description && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="shrink-0 px-4 pb-2 pt-1 text-center text-sm leading-relaxed text-white/60 max-w-2xl mx-auto sm:px-6 sm:pb-3 sm:pt-0"
          onClick={(e) => e.stopPropagation()}
        >
          {activeVideo.description}
        </motion.p>
      )}

      {hasMultiple && (
        <CinemaThumbnailStrip listRef={thumbnailListRef}>
          {videos.map((video, i) => {
            const isActive = i === activeIndex;
            const thumb = getVideoThumbnailUrl(video.url, video.thumbnail);
            return (
              <button
                key={video.id}
                ref={isActive ? activeThumbRef : undefined}
                type="button"
                onClick={() => goTo(i)}
                className={cinemaThumbClasses(isActive)}
                aria-label={video.title ?? `Témoignage ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <motion.div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                    <Play className="size-5 text-white/50" fill="currentColor" />
                  </motion.div>
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
