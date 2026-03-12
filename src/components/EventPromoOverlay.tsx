"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEventPromoOverlay } from "@/hooks/useEventPromoOverlay";
import { featuredEvent } from "@/components/_config/event-promo.config";

// ─── Variants d'animation ──────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: "easeIn" as const } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 24,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.35 } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.45 + i * 0.08, duration: 0.4 },
  }),
};

// ─── Composant principal ───────────────────────────────────────────────────

export default function EventPromoOverlay() {
  const { isVisible, close } = useEventPromoOverlay(900);
  const event = featuredEvent;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ── Backdrop flouté ── */}
          <motion.div
            key="event-promo-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
            onClick={close}
            aria-hidden="true"
          />

          {/* ── Bruit de grain subtil par-dessus le backdrop ── */}
          <motion.div
            key="event-promo-grain"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9998] pointer-events-none opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
            }}
          />

          {/* ── Halos de couleur animés en arrière-plan ── */}
          <motion.div
            key="event-promo-halos"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-amber-400 blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-lime-400 blur-[140px]"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-300 blur-[100px]"
            />
          </motion.div>

          {/* ── Carte de l'événement ── */}
          <div
            key="event-promo-container"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.article
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label={`Événement à venir : ${event.title}`}
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/50"
            >
              {/* ── Bouton fermeture ── */}
              <motion.button
                onClick={close}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors duration-200 cursor-pointer"
                aria-label="Fermer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {/* ── Image de l'événement ── */}
              <div className="relative w-full h-52 sm:h-60 overflow-hidden">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-lime-200 flex items-center justify-center">
                    <span className="text-6xl">📅</span>
                  </div>
                )}

                {/* Overlay gradient sur l'image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge */}
                {event.badge && (
                  <motion.span
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute top-4 left-4 px-3 py-1 text-xs font-bold tracking-widest uppercase text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg shadow-amber-500/30"
                  >
                    {event.badge}
                  </motion.span>
                )}

                {/* Date sur l'image */}
                <motion.div
                  custom={0}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute bottom-4 left-4 right-4"
                >
                  <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <svg
                      className="w-4 h-4 text-amber-300 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {event.date}
                  </div>
                </motion.div>
              </div>

              {/* ── Contenu textuel ── */}
              <div className="px-6 py-5 space-y-3">
                {/* Titre */}
                <motion.div
                  custom={1}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                    {event.title}
                  </h2>
                  {event.subtitle && (
                    <p className="mt-0.5 text-sm font-medium bg-gradient-to-r from-amber-500 to-lime-500 bg-clip-text text-transparent">
                      {event.subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Lieu */}
                <motion.div
                  custom={2}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-1.5 text-gray-500 text-sm"
                >
                  <svg
                    className="w-4 h-4 text-amber-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {event.location}
                </motion.div>

                {/* Description */}
                <motion.p
                  custom={3}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-sm text-gray-600 leading-relaxed line-clamp-3"
                >
                  {event.description}
                </motion.p>

                {/* ── Actions ── */}
                <motion.div
                  custom={4}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 pt-1"
                >
                  {/* CTA principal */}
                  {event.ctaLink && (
                    <Link href={event.ctaLink} onClick={close} className="flex-1">
                      <motion.span
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 shadow-lg shadow-amber-400/30 overflow-hidden cursor-pointer"
                      >
                        {/* Shine au hover */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <span className="relative">{event.ctaLabel ?? "En savoir plus"}</span>
                        <svg
                          className="w-4 h-4 relative transition-transform duration-200 group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </motion.span>
                    </Link>
                  )}

                  {/* Fermer discrètement */}
                  <motion.button
                    onClick={close}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  >
                    Plus tard
                  </motion.button>
                </motion.div>

                {/* Ligne décorative bas de carte */}
                <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
              </div>
            </motion.article>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
