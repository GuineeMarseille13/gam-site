"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/helpers/utils";
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery";

import { ProspectusCarousel } from "./event-promo/prospectus-carousel";

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

function imgUrl(id: string, w = 900) {
  return cloudinaryImageUrl(id, `w_${w},q_auto,f_auto`);
}

// ── Styles de carte ───────────────────────────────────────────────────────────

// Prospectus : largeur bornée par la hauteur d'écran (cadre 5/7 + pied ≈ 10rem) pour rester entièrement visible.
const CARD_CLASSES: Record<PopupData["type"], string> = {
  IMAGE_TEXT: "w-full max-w-sm bg-gray-950 ring-white/20",
  PROSPECTUS: "w-[min(100%,34rem,calc((100dvh-10rem)*5/7))] bg-white ring-white/50",
};

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
              className={cn(
                "relative overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1",
                CARD_CLASSES[popup.type],
              )}
            >

              {popup.type === "IMAGE_TEXT" ? (
                <ImageTextContent popup={popup} close={close} />
              ) : (
                <ProspectusCarousel imageIds={popup.prospectusIds} onClose={close} />
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
  const hasMeta = popup.date || popup.location;

  return (
    <div className="max-h-[92dvh] overflow-y-auto">

      {/* ── Header : badge + fermer — hors image ── */}
      <div className="flex items-center justify-between gap-2 bg-gray-950 px-4 py-3">
        {popup.badge ? (
          <motion.span
            variants={badgeVariants} initial="hidden" animate="visible"
            className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow"
          >
            {popup.badge}
          </motion.span>
        ) : <span />}

        <motion.button
          onClick={close}
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Fermer"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>

      {/* ── Image — proportions naturelles ── */}
      {popup.imageId ? (
        <Image
          src={imgUrl(popup.imageId, 600)}
          alt={popup.title ?? "Annonce"}
          width={600}
          height={900}
          className="w-full h-auto"
          priority
        />
      ) : (
        <div className="flex aspect-[2/3] w-full items-center justify-center bg-gradient-to-br from-amber-400/20 to-lime-400/10">
          <span className="text-6xl opacity-40">📅</span>
        </div>
      )}

      {/* ── Zone texte ── */}
      <div className="space-y-3 bg-gray-950 px-5 pb-5 pt-4">

        {/* Date + lieu — même ligne */}
        {hasMeta && (
          <motion.div
            custom={0} variants={contentVariants} initial="hidden" animate="visible"
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5"
          >
            {popup.date && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                <svg className="h-3.5 w-3.5 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {popup.date}
              </span>
            )}
            {popup.date && popup.location && (
              <span className="h-3 w-px bg-white/15" aria-hidden />
            )}
            {popup.location && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                <svg className="h-3.5 w-3.5 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {popup.location}
              </span>
            )}
          </motion.div>
        )}

        {/* Titre + sous-titre */}
        {(popup.title || popup.subtitle) && (
          <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible">
            {popup.title && (
              <h2 className="text-lg font-black leading-snug text-white">{popup.title}</h2>
            )}
            {popup.subtitle && (
              <p className="mt-0.5 text-sm font-semibold text-amber-400">{popup.subtitle}</p>
            )}
          </motion.div>
        )}

        {/* Description */}
        {popup.description && (
          <motion.p
            custom={2} variants={contentVariants} initial="hidden" animate="visible"
            className="text-sm leading-relaxed text-white/50 line-clamp-3"
          >
            {popup.description}
          </motion.p>
        )}

        {/* Actions */}
        <motion.div
          custom={3} variants={contentVariants} initial="hidden" animate="visible"
          className="flex flex-col gap-2 pt-1"
        >
          {popup.ctaUrl && (
            <Link href={popup.ctaUrl} onClick={close}>
              <motion.span
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-lime-400 px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg shadow-amber-500/25"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{popup.ctaLabel ?? "En savoir plus"}</span>
                <svg className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.span>
            </Link>
          )}
          <motion.button
            onClick={close}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            className="w-full cursor-pointer rounded-full py-2 text-sm font-medium text-white/35 transition-colors hover:bg-white/6 hover:text-white/60"
          >
            Fermer
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
