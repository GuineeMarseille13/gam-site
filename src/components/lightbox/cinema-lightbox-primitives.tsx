"use client";

import type { ReactNode, RefObject } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/helpers/utils";

export const cinemaSlideVariants = {
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

interface CinemaNavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
  size?: "default" | "compact";
}

/** Bouton prev/next — zone cliquable limitée au cercle. */
export function CinemaNavButton({
  direction,
  onClick,
  className,
  size = "default",
}: CinemaNavButtonProps) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const label = isPrev ? "Média précédent" : "Média suivant";

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

interface CinemaMobileNavBarProps {
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Navigation mobile sous le média — hors zone de contenu. */
export function CinemaMobileNavBar({
  activeIndex,
  total,
  onPrev,
  onNext,
}: CinemaMobileNavBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="mx-auto flex w-full max-w-5xl items-center justify-center gap-4 px-3 pb-2 sm:hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <CinemaNavButton direction="prev" onClick={onPrev} size="compact" />
      <p className="min-w-[4.5rem] text-center text-xs font-medium tabular-nums text-white/50">
        {activeIndex + 1}
        <span className="text-white/30"> / </span>
        {total}
      </p>
      <CinemaNavButton direction="next" onClick={onNext} size="compact" />
    </motion.div>
  );
}

interface CinemaAmbientBackgroundProps {
  imageUrl?: string | null;
}

/** Fond ambiant flouté avec overlays animés — style lecteur cinéma. */
export function CinemaAmbientBackground({ imageUrl }: CinemaAmbientBackgroundProps) {
  return (
    <motion.div
      key={imageUrl ?? "no-ambient"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 -z-10 pointer-events-none"
      aria-hidden
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
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
  );
}

interface CinemaHeaderProps {
  label: string;
  title?: string | null;
  activeIndex?: number;
  total?: number;
  onClose: () => void;
}

/** En-tête glassmorphism avec titre et compteur. */
export function CinemaHeader({
  label,
  title,
  activeIndex,
  total,
  onClose,
}: CinemaHeaderProps) {
  const hasCounter =
    typeof activeIndex === "number" &&
    typeof total === "number" &&
    total > 1;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex shrink-0 items-start justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-5 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="pointer-events-auto min-w-0 max-w-[min(100%,calc(100%-3rem))] rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.25)] sm:max-w-[28rem] sm:rounded-2xl sm:px-4 sm:py-3"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/90">
          {label}
        </p>
        {title && (
          <p className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
            {title}
          </p>
        )}
        {hasCounter && (
          <p className="mt-1.5 text-xs text-white/50 tabular-nums">
            {activeIndex + 1} / {total}
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
        aria-label="Fermer"
      >
        <X className="size-5" strokeWidth={2} />
      </motion.button>
    </header>
  );
}

interface CinemaMediaShellProps {
  children: ReactNode;
  className?: string;
}

/** Conteneur média avec halo animé — cadre du lecteur cinéma. */
export function CinemaMediaShell({ children, className }: CinemaMediaShellProps) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px -16px rgba(0,0,0,0.55), 0 0 80px -20px rgba(239,68,68,0.15)",
          "0 0 0 1px rgba(255,255,255,0.12), 0 40px 80px -16px rgba(0,0,0,0.6), 0 0 100px -16px rgba(251,191,36,0.2)",
          "0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px -16px rgba(0,0,0,0.55), 0 0 80px -20px rgba(239,68,68,0.15)",
        ],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "relative w-full max-w-5xl overflow-visible rounded-2xl sm:rounded-3xl",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

interface CinemaThumbnailStripProps {
  children: ReactNode;
  listRef?: RefObject<HTMLDivElement | null>;
}

/** Bandeau horizontal de miniatures — style filmstrip cinéma. */
export function CinemaThumbnailStrip({ children, listRef }: CinemaThumbnailStripProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      ref={listRef}
      onClick={(e) => e.stopPropagation()}
      className="flex shrink-0 overflow-x-auto px-3 py-3 sm:px-6 sm:py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <motion.div
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto flex w-fit max-w-full justify-center gap-3 sm:gap-3.5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Classes communes pour une miniature active / inactive. */
export function cinemaThumbClasses(isActive: boolean): string {
  return cn(
    "relative flex size-[4.25rem] shrink-0 overflow-hidden rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 sm:size-[4.75rem] sm:rounded-2xl",
    isActive
      ? "scale-105 ring-2 ring-white shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
      : "opacity-70 ring-2 ring-white/15 hover:opacity-100 hover:ring-white/35",
  );
}
