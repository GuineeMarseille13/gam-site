"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Play, X } from "lucide-react";
import type { VideoTestimonial } from "@/app/_services/home";
import {
  buildTestimonialEmbedUrl,
  getVideoThumbnailUrl,
  parseVideoUrl,
} from "@/helpers/video-urls";
import { cn } from "@/helpers/utils";

interface VideoNavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
  size?: "default" | "compact";
}

/**
 * Bouton prev/next — zone cliquable limitée au cercle (pas de bandeau sur l’iframe).
 */
function VideoNavButton({
  direction,
  onClick,
  className,
  size = "default",
}: VideoNavButtonProps) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const label = isPrev ? "Vidéo précédente" : "Vidéo suivante";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-xl transition-transform hover:scale-105 hover:bg-black/85 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 touch-manipulation",
        size === "compact" ? "size-11" : "size-10 sm:size-11",
        className,
      )}
      aria-label={label}
    >
      <Icon className="size-5 sm:size-6" strokeWidth={2} />
    </button>
  );
}

interface MobileVideoNavBarProps {
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Navigation mobile sous le lecteur — hors zone des contrôles YouTube. */
function MobileVideoNavBar({
  activeIndex,
  total,
  onPrev,
  onNext,
}: MobileVideoNavBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="mx-auto flex w-full max-w-5xl items-center justify-center gap-4 px-3 pb-2 sm:hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <VideoNavButton direction="prev" onClick={onPrev} size="compact" />
      <p className="min-w-[4.5rem] text-center text-xs font-medium tabular-nums text-white/50">
        {activeIndex + 1}
        <span className="text-white/30"> / </span>
        {total}
      </p>
      <VideoNavButton direction="next" onClick={onNext} size="compact" />
    </motion.div>
  );
}

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 56 : -56,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 56 : -56,
    opacity: 0,
    scale: 0.97,
  }),
};

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
      <motion.div
        key={ambientThumb ?? "no-thumb"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
      >
        {ambientThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ambientThumb}
            alt=""
            className="absolute inset-0 -m-[30%] h-[160%] w-[160%] scale-110 object-cover blur-[90px] saturate-150 opacity-45"
            draggable={false}
          />
        ) : (
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 20% 30%, rgba(239,68,68,0.25), transparent 55%)",
                "radial-gradient(circle at 80% 70%, rgba(251,191,36,0.22), transparent 55%)",
                "radial-gradient(circle at 20% 30%, rgba(239,68,68,0.25), transparent 55%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
          />
        )}
        <motion.div
          animate={{ opacity: [0.75, 0.9, 0.75] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-neutral-950/85 backdrop-blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.4, 0.65, 0.4],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 h-[min(55vw,420px)] w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-500/20 via-red-500/15 to-orange-400/10 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-transparent to-neutral-950/80"
        />
      </motion.div>

      <header className="absolute top-0 left-0 right-0 z-20 flex shrink-0 items-start justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-5 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="pointer-events-auto min-w-0 max-w-[min(100%,calc(100%-3rem))] rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.25)] sm:max-w-[28rem] sm:rounded-2xl sm:px-4 sm:py-3"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/90">
            Témoignage
          </p>
          {activeVideo.title && (
            <p className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
              {activeVideo.title}
            </p>
          )}
          {hasMultiple && (
            <p className="mt-1.5 text-xs text-white/50 tabular-nums">
              {activeIndex + 1} / {videos.length}
            </p>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.3 }}
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Fermer le lecteur"
        >
          <X className="size-5" strokeWidth={2} />
        </motion.button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex flex-1 min-h-0 w-full items-center justify-center px-3 pb-0 pt-[4.75rem] sm:px-8 sm:pb-2 sm:pt-24 md:px-16",
          hasMultiple && "sm:px-16 md:px-20",
        )}
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px -16px rgba(0,0,0,0.55), 0 0 80px -20px rgba(239,68,68,0.15)",
              "0 0 0 1px rgba(255,255,255,0.12), 0 40px 80px -16px rgba(0,0,0,0.6), 0 0 100px -16px rgba(251,191,36,0.2)",
              "0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px -16px rgba(0,0,0,0.55), 0 0 80px -20px rgba(239,68,68,0.15)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full max-w-5xl overflow-visible rounded-2xl sm:rounded-3xl"
        >
          <div
            className="relative w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeVideo.id}
                custom={direction}
                variants={slideVariants}
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
                <VideoNavButton
                  direction="prev"
                  onClick={goPrev}
                  className="absolute top-1/2 left-0 z-30 hidden -translate-x-[calc(100%+0.75rem)] -translate-y-1/2 sm:flex"
                />
                <VideoNavButton
                  direction="next"
                  onClick={goNext}
                  className="absolute top-1/2 right-0 z-30 hidden translate-x-[calc(100%+0.75rem)] -translate-y-1/2 sm:flex"
                />
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {hasMultiple && (
        <MobileVideoNavBar
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          ref={thumbnailListRef}
          onClick={(e) => e.stopPropagation()}
          className="flex shrink-0 overflow-x-auto px-3 py-3 sm:px-6 sm:py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <motion.div
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto flex w-fit max-w-full justify-center gap-3 sm:gap-3.5"
          >
            {videos.map((video, i) => {
              const isActive = i === activeIndex;
              const thumb = getVideoThumbnailUrl(video.url, video.thumbnail);
              return (
                <button
                  key={video.id}
                  ref={isActive ? activeThumbRef : undefined}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`relative flex size-[4.25rem] shrink-0 overflow-hidden rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 sm:size-[4.75rem] sm:rounded-2xl ${
                    isActive
                      ? "scale-105 ring-2 ring-white shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
                      : "opacity-70 ring-2 ring-white/15 hover:opacity-100 hover:ring-white/35"
                  }`}
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
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
