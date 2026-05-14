"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { VideoTestimonial } from "@/app/_services/home";
import { SectionSplitHeading } from "@/components/section-split-heading";

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
      whileHover={{ scale: 1.03, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      whileTap={{ scale: 0.98 }}
      className="shrink-0 w-[82vw] sm:w-[340px] md:w-[380px] cursor-pointer group h-full"
      onClick={onClick}
    >

<div className="relative h-full rounded-2xl overflow-hidden ring-1 ring-white/0 group-hover:ring-white/20 shadow-md group-hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] transition-all duration-500">

        {/* Thumbnail full-card */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={video.title ?? "Témoignage vidéo"}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
          )}

          {/* Overlay de base */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/5 transition-opacity duration-500" />
          {/* Overlay supplémentaire au hover — assombrit le haut pour le badge */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

          {/* Badge top-right */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-white/80 tracking-wide uppercase">Vidéo</span>
          </div>

          {/* Play button centré */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Double ring de glow */}
              <span className="absolute w-14 h-14 rounded-full bg-white/10 scale-100 group-hover:scale-[2] opacity-0 group-hover:opacity-100 transition-all duration-600 ease-out" />
              <span className="absolute w-14 h-14 rounded-full bg-red-500/20 scale-100 group-hover:scale-[2.6] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-75" />
              {/* Bouton */}
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 group-hover:bg-white group-hover:border-white group-hover:scale-110 shadow-lg transition-all duration-350 ease-out"
              >
                <Play
                  className="w-5 h-5 translate-x-[2px] text-white group-hover:text-red-500 transition-colors duration-300"
                  fill="currentColor"
                />
              </motion.div>
            </div>
          </div>

          {/* Texte en bas — glisse vers le haut au hover */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-400 ease-out">
            {video.title && (
              <p className="text-sm font-bold text-white leading-snug line-clamp-1 drop-shadow-md">
                {video.title}
              </p>
            )}
            {video.description && (
              <p className="text-[11px] text-white/60 group-hover:text-white/80 mt-1 line-clamp-2 leading-relaxed transition-colors duration-300">
                {video.description}
              </p>
            )}
            {!video.title && !video.description && (
              <p className="text-[11px] text-white/50 italic">Cliquez pour visionner</p>
            )}

            {/* CTA — apparaît au hover */}
            <div className="mt-2.5 flex items-center gap-1.5 text-red-400 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300 delay-75">
              <Play className="w-2.5 h-2.5 shrink-0" fill="currentColor" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">Regarder</span>
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

  // Doublon uniquement s’il y a au moins 2 vidéos : le défilement infini a besoin d’une 2e copie.
  // Avec une seule vidéo, on affiche exactement une carte (aligné sur la base).
  const displayVideos = useMemo(
    () => (videos.length > 1 ? [...videos, ...videos] : videos),
    [videos],
  );

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
  }, [videos.length, displayVideos.length, paused, activeIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveIndex(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (videos.length === 0) return null;

  const activeVideo = activeIndex !== null ? videos[activeIndex] : null;


  return (  
    <section className="relative w-full py-10 sm:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/60 to-amber-50/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,rgba(251,191,36,0.10),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(239,68,68,0.07),transparent)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionSplitHeading
              showAmbient={false}
              title="Témoignages"
              tone="video"
            />
            <p className="mt-3 text-base sm:mt-4 sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
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
              {displayVideos.map((v, i) => (
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
