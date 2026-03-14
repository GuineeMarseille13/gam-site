"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { VideoTestimonial } from "@/app/_services/home";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getThumbnail(video: VideoTestimonial): string | null {
  if (video.thumbnail) return video.thumbnail;
  const ytId = getYouTubeId(video.url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  return null;
}

function getEmbedInfo(url: string): { type: "youtube" | "vimeo" | "direct"; embedUrl: string } {
  const ytId = getYouTubeId(url);
  if (ytId) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` };
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
  return { type: "direct", embedUrl: url };
}

// ---------------------------------------------------------------------------
// Video Player
// ---------------------------------------------------------------------------

function VideoPlayer({ url }: { url: string }) {
  const { type, embedUrl } = getEmbedInfo(url);
  if (type === "direct") {
    return (
      <video
        src={embedUrl}
        controls
        autoPlay
        playsInline
        className="w-full h-full rounded-2xl object-contain bg-black"
      />
    );
  }
  return (
    <iframe
      src={embedUrl}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="w-full h-full rounded-2xl"
      style={{ border: "none" }}
      title="Témoignage vidéo"
    />
  );
}

// ---------------------------------------------------------------------------
// Video Card
// ---------------------------------------------------------------------------

interface CardProps {
  video: VideoTestimonial;
  index: number;
  onClick: () => void;
}

function VideoCard({ video, index, onClick }: CardProps) {
  const thumb = getThumbnail(video);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="shrink-0 w-[82vw] xs:w-[82vw] sm:w-[400px] md:w-[440px] cursor-pointer group h-full"
      onClick={onClick}
    >
      <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-black/40">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-800">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={video.title ?? "Témoignage vidéo"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-white/20 scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-[2] transition-all duration-500" />
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className="relative w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-black/50 group-hover:bg-white transition-colors duration-200"
              >
                <Play className="w-6 h-6 text-slate-900 translate-x-0.5" fill="currentColor" />
              </motion.div>
            </div>
          </div>

          {/* Duration badge placeholder */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
            <span className="text-[10px] font-medium text-white/80 tracking-wide">▶ Lire</span>
          </div>
        </div>

        {/* Card footer */}
        <div className="flex-1 p-4 bg-black/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Quote className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
            <div className="min-w-0">
              {video.title && (
                <p className="text-sm font-semibold text-white line-clamp-1 leading-snug">
                  {video.title}
                </p>
              )}
              {video.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              )}
              {!video.title && !video.description && (
                <p className="text-xs text-slate-500 italic">Cliquez pour visionner</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Section
// ---------------------------------------------------------------------------

interface VideoTestimonialsSectionProps {
  videos: VideoTestimonial[];
}

const AUTO_SPEED = 50; // px/s

export default function VideoTestimonialsSection({ videos }: VideoTestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Liste doublée pour le loop circulaire seamless
  const loopVideos = useMemo(() => [...videos, ...videos], [videos]);

  useEffect(() => { setMounted(true); }, []);

  // Scroll circulaire continu via requestAnimationFrame
  useEffect(() => {
    if (videos.length <= 1 || paused || activeIndex !== null) return;
    const el = scrollRef.current;
    if (!el) return;
    let last = performance.now();
    let animId: number;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!scrollRef.current) return;
      const s = scrollRef.current;
      s.scrollLeft += AUTO_SPEED * dt;
      // Réinitialisation silencieuse au milieu → loop parfait
      if (s.scrollLeft >= s.scrollWidth / 2) s.scrollLeft -= s.scrollWidth / 2;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [videos.length, loopVideos.length, paused, activeIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveIndex(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (videos.length === 0) return null;

  const activeVideo = activeIndex !== null ? videos[activeIndex] : null;


  return (
    <section className="relative w-full py-16 sm:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-neutral-900 to-stone-950" />
      {/* Warm radial glows — cohérents avec la palette amber/red du site */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(245,158,11,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_80%_100%,rgba(239,68,68,0.06),transparent)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-red-400/80 mb-3">
              Témoignages
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Ils parlent de nous
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500/60" />
            </div>
            <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Découvrez les témoignages de ceux qui font vivre l&apos;association au quotidien.
            </p>
          </motion.div>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-[100rem] mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Scrollable track — overflow hidden, scroll piloté par rAF */}
          <div
            ref={scrollRef}
            className="overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-4"
          >
            <div className="flex gap-4 sm:gap-6">
              {loopVideos.map((v, i) => (
                <div key={`${v.id}-${i}`} className="shrink-0">
                  <VideoCard video={v} index={i % videos.length} onClick={() => setActiveIndex(i % videos.length)} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-8 md:p-12"
              onClick={() => setActiveIndex(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

              {/* Player */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-5xl aspect-video z-10 max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Glow behind player */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/15 via-red-600/20 to-amber-600/15 rounded-3xl blur-2xl" />

                {/* Video container — absolute inset-0 pour avoir une hauteur définie */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
                  <VideoPlayer url={activeVideo.url} />
                </div>

                {/* Close */}
                <button
                  onClick={() => setActiveIndex(null)}
                  className="absolute -top-4 right-0 sm:-top-5 sm:-right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-xl transition-all duration-200 z-20"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Title below */}
                {activeVideo.title && (
                  <div className="absolute -bottom-7 sm:-bottom-9 left-0 right-0 text-center">
                    <p className="text-[10px] sm:text-xs font-medium text-white/50 tracking-wide truncate px-4">{activeVideo.title}</p>
                  </div>
                )}

                {/* Prev / Next — hors player sur mobile pour ne pas gêner */}
                {videos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveIndex((activeIndex! - 1 + videos.length) % videos.length)}
                      className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white transition-all z-20"
                      aria-label="Précédent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveIndex((activeIndex! + 1) % videos.length)}
                      className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white transition-all z-20"
                      aria-label="Suivant"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
