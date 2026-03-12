"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Marquee } from "@/components/Marquee";
import { featuredEvent as defaultEvent, type FeaturedEvent } from "@/components/_config/event-promo.config";

export interface BannerCardProps {
  /** Événement à afficher. Par défaut : featuredEvent de la config. */
  event?: FeaturedEvent;
  /** Seuil en px à partir duquel le bandeau passe en bas. Par défaut : 80. */
  scrollThreshold?: number;
}

function Separator() {
  return (
    <span className="mx-6 text-white/40 select-none" aria-hidden>
      ✦
    </span>
  );
}

function BannerItem({ event }: { event: FeaturedEvent }) {
  return (
    <span className="flex items-center gap-4 text-base font-medium text-white whitespace-nowrap">
      {event.badge && (
        <span className="px-3 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full bg-white/25 border border-white/40 shadow-sm">
          {event.badge}
        </span>
      )}
      <span className="font-bold text-[15px]">{event.title}</span>
      <span className="flex items-center gap-1.5 text-white/90">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {event.date}
      </span>
      <span className="flex items-center gap-1.5 text-white/90">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {event.location}
      </span>
      <Separator />
    </span>
  );
}

function BannerContent({ event }: { event: FeaturedEvent }) {
  return (
    <div className="relative w-full py-2 overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 shadow-md shadow-amber-400/30">
      {/* Effet de brillance animé */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 4s linear infinite",
        }}
      />
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>

      {/* Dégradés bords */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-amber-500 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-lime-500 to-transparent z-10 pointer-events-none" />

      <Marquee
        className="py-5 [--duration:35s] [--gap:0rem] p-0"
        pauseOnHover
        repeat={6}
        ariaLabel={`Événement à venir : ${event.title}`}
      >
        <BannerItem event={event} />
      </Marquee>
    </div>
  );
}

export default function BannerCard({ event = defaultEvent, scrollThreshold = 80 }: BannerCardProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Position naturelle (en haut, dans le flux) — disparaît au scroll */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            key="banner-top"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeIn" as const }}
          >
            <BannerContent event={event} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Position fixe en bas — apparaît au scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            key="banner-bottom"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <BannerContent event={event} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
