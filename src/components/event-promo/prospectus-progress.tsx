"use client";

import { AnimatePresence, motion } from "motion/react";
import { Pause } from "lucide-react";

import { PROSPECTUS_SLIDE_DELAY_MS } from "./use-prospectus-carousel";

interface ProspectusProgressProps {
  total: number;
  index: number;
  isPaused: boolean;
  cycleKey: string;
}

/**
 * Composant: ProspectusProgress
 * Rôle: Barres de progression façon « stories » + indicateur de pause, dans la bande haute du cadre.
 */
export function ProspectusProgress({ total, index, isPaused, cycleKey }: ProspectusProgressProps) {
  const bars = Array.from({ length: total }, (_, i) => i);
  const activeDuration = isPaused ? 0.2 : PROSPECTUS_SLIDE_DELAY_MS / 1000;

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center gap-2 px-3">
      <div key={cycleKey} className="flex flex-1 gap-1">
        {bars.map((i) => (
          <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
            {i < index && <div className="h-full w-full bg-white/80" />}
            {i === index && (
              <motion.div
                className="h-full origin-left bg-amber-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isPaused ? 0 : 1 }}
                transition={{ duration: activeDuration, ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isPaused && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
            role="status"
            aria-label="En pause"
          >
            <Pause className="size-3" fill="currentColor" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
