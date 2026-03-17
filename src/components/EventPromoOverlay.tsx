"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

export type PopupData = {
  id: string;
  type: "IMAGE_TEXT" | "PROSPECTUS";
  isActive: boolean;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  date?: string | null;
  location?: string | null;
  imageId?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  prospectusIds: string[];
};

const CLOUD = "df3ymbrqe";
function imgUrl(id: string, w = 900) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/w_${w},q_auto,f_auto/${id}`;
}

// ── Variants d'animation ──────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: "easeIn" as const } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.08 } },
  exit: { opacity: 0, scale: 0.92, y: 24, transition: { duration: 0.3, ease: "easeIn" as const } },
};

const badgeVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.35 } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.45 + i * 0.08, duration: 0.4 } }),
};

// ── Composant principal ────────────────────────────────────────────────────────

export default function EventPromoOverlay({ popup }: { popup: PopupData | null }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!popup?.isActive) return;
    const t = setTimeout(() => setIsVisible(true), 900);
    return () => clearTimeout(t);
  }, [popup]);

  const close = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    if (!isVisible) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isVisible, close]);

  if (!popup?.isActive) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
            onClick={close} aria-hidden="true"
          />

          {/* Grain */}
          <motion.div
            key="grain"
            variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[9998] pointer-events-none opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
            }}
          />

          {/* Halos */}
          <motion.div key="halos" variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-amber-400 blur-[120px]" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-lime-400 blur-[140px]" />
          </motion.div>

          {/* Carte */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <motion.article
              variants={cardVariants} initial="hidden" animate="visible" exit="exit"
              role="dialog" aria-modal="true"
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/50"
            >
              {/* Bouton fermeture — uniquement pour IMAGE_TEXT (PROSPECTUS a son propre footer) */}
              {popup.type === "IMAGE_TEXT" && (
                <motion.button
                  onClick={close}
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}

              {popup.type === "IMAGE_TEXT" ? (
                <ImageTextContent popup={popup} close={close} />
              ) : (
                <ProspectusContent popup={popup} close={close} />
              )}
            </motion.article>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── IMAGE_TEXT ─────────────────────────────────────────────────────────────────

function ImageTextContent({ popup, close }: { popup: PopupData; close: () => void }) {
  return (
    <>
      {/* Image */}
      <div className="relative w-full h-52 sm:h-60 overflow-hidden">
        {popup.imageId ? (
          <Image src={imgUrl(popup.imageId)} alt={popup.title ?? "Annonce"} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-200 to-lime-200 flex items-center justify-center">
            <span className="text-6xl">📅</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {popup.badge && (
          <motion.span variants={badgeVariants} initial="hidden" animate="visible"
            className="absolute top-4 left-4 px-3 py-1 text-xs font-bold tracking-widest uppercase text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg">
            {popup.badge}
          </motion.span>
        )}

        {popup.date && (
          <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible"
            className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <svg className="w-4 h-4 text-amber-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {popup.date}
            </div>
          </motion.div>
        )}
      </div>

      {/* Texte */}
      <div className="px-6 py-5 space-y-3">
        <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible">
          {popup.title && (
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">{popup.title}</h2>
          )}
          {popup.subtitle && (
            <p className="mt-0.5 text-sm font-medium bg-gradient-to-r from-amber-500 to-lime-500 bg-clip-text text-transparent">
              {popup.subtitle}
            </p>
          )}
        </motion.div>

        {popup.location && (
          <motion.div custom={2} variants={contentVariants} initial="hidden" animate="visible"
            className="flex items-center gap-1.5 text-gray-500 text-sm">
            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {popup.location}
          </motion.div>
        )}

        {popup.description && (
          <motion.p custom={3} variants={contentVariants} initial="hidden" animate="visible"
            className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {popup.description}
          </motion.p>
        )}

        <motion.div custom={4} variants={contentVariants} initial="hidden" animate="visible"
          className="flex items-center gap-3 pt-1">
          {popup.ctaUrl && (
            <Link href={popup.ctaUrl} onClick={close} className="flex-1">
              <motion.span
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 shadow-lg shadow-amber-400/30 overflow-hidden cursor-pointer">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative">{popup.ctaLabel ?? "En savoir plus"}</span>
                <svg className="w-4 h-4 relative transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.span>
            </Link>
          )}
          <motion.button onClick={close} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap">
            Plus tard
          </motion.button>
        </motion.div>

        <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      </div>
    </>
  );
}

// ── PROSPECTUS ─────────────────────────────────────────────────────────────────

const SLIDE_DELAY = 6500; // ms entre chaque slide

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] as const } },
  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" as const } }),
};

function NavArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition-all hover:bg-amber-500 hover:scale-105 active:scale-95"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        {dir === "prev"
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        }
      </svg>
    </button>
  );
}

function ProspectusContent({ popup, close }: { popup: PopupData; close: () => void }) {
  const ids = popup.prospectusIds;
  const total = ids.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  // Incrémenté à chaque reprise pour forcer le restart des barres de progression
  const [resumeKey, setResumeKey] = useState(0);

  function goTo(next: number, dir: number) { setDirection(dir); setIndex(next); }
  function goNext() { goTo((index + 1) % total, 1); }
  function goPrev() { goTo((index - 1 + total) % total, -1); }

  function handleMouseEnter() { setPaused(true); }
  function handleMouseLeave() { setPaused(false); setResumeKey((k) => k + 1); }

  // Auto-avance — suspendu au hover, reprend sur mouse leave
  useEffect(() => {
    if (total <= 1 || paused) return;
    const t = setTimeout(goNext, SLIDE_DELAY);
    return () => clearTimeout(t);
  }, [index, total, paused, resumeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (total === 0) return (
    <div className="flex h-64 items-center justify-center text-sm text-gray-400">Aucune image</div>
  );

  // Clé des barres : change à chaque slide ET à chaque reprise pour reset l'animation
  const barKey = `${index}-${resumeKey}`;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-3xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* ── Image avec transition ── */}
      <div className="relative overflow-hidden bg-gray-950" style={{ maxHeight: "80dvh" }}>

        {/* Barres de progression */}
        {total > 1 && (
          <div key={barKey} className="absolute top-0 left-0 right-0 z-10 flex gap-1 px-3 pt-3">
            {ids.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                {i < index ? (
                  <div className="h-full w-full bg-white/80" />
                ) : i === index ? (
                  <motion.div
                    className="h-full origin-left bg-amber-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? undefined : 1 }}
                    transition={{ duration: SLIDE_DELAY / 1000, ease: "linear" }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Indicateur pause */}
        <AnimatePresence>
          {paused && total > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm"
            >
              <span className="flex gap-0.5">
                <span className="block h-3 w-[3px] rounded-full bg-white" />
                <span className="block h-3 w-[3px] rounded-full bg-white" />
              </span>
              En pause
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl(ids[index], 900)}
              alt={`Prospectus ${index + 1} / ${total}`}
              className="w-full object-contain"
              style={{ maxHeight: "80dvh" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-3">

        {/* Navigation */}
        {total > 1 ? (
          <div className="flex items-center gap-3">
            <NavArrow dir="prev" onClick={goPrev} />

            <div className="flex items-center gap-1.5">
              {ids.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={`rounded-full transition-all duration-300 ${
                    i === index ? "w-6 h-2 bg-amber-500" : "size-2 bg-gray-300 hover:bg-amber-300"
                  }`}
                />
              ))}
            </div>

            <NavArrow dir="next" onClick={goNext} />
          </div>
        ) : (
          <div />
        )}

        {/* Fermer */}
        <button
          onClick={close}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Fermer
        </button>
      </div>
    </div>
  );
}
