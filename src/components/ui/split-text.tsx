"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/helpers/utils";

interface TextSplitProps {
  children: string;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
  maxMove?: number;
  falloff?: number;
}

/** Ressort doux pour le déplacement des demi-glyphes (60 fps, peu d’oscillation). */
const LETTER_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 32,
  mass: 0.42,
};

/**
 * Découpe une chaîne en caractères animés (effet Berlix : moitiés haut / bas au survol).
 * @see https://berlix.vercel.app/docs/text-split — `topClassName` / `bottomClassName` sur chaque demi-glyphe.
 */
export function TextSplit({
  children,
  className,
  topClassName,
  bottomClassName,
  maxMove = 50,
  falloff = 0.3,
}: TextSplitProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getOffset = (index: number) => {
    if (hoverIndex === null) return 0;
    const distance = Math.abs(index - hoverIndex);
    return Math.max(0, maxMove * (1 - distance * falloff));
  };

  return (
    <span
      className={cn(
        "relative inline-flex items-center leading-none",
        className,
      )}
    >
      {children.split("").map((char, index) => {
        const offset = getOffset(index);
        const displayChar = char === " " ? "\u00A0" : char;

        return (
          <span
            key={`${char}-${index}`}
            className={cn(
              "relative inline-flex min-w-[0.45em] flex-col overflow-hidden text-[1em] leading-none",
            )}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <motion.span
              initial={false}
              animate={{
                y: offset === 0 ? 0 : `-${offset}%`,
              }}
              transition={LETTER_SPRING}
              className="flex h-[0.5em] w-full shrink-0 items-start justify-center overflow-hidden transform-gpu"
            >
              <span
                className={cn(
                  "inline-flex min-h-[1em] min-w-[0.35em] items-start justify-center leading-none",
                  topClassName,
                )}
              >
                {displayChar}
              </span>
            </motion.span>

            {displayChar !== "\u00A0" && offset === 0 ? (
              <span
                aria-hidden
                className="pointer-events-none absolute left-[6%] right-[6%] top-1/2 z-20 h-px -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.45)_18%,#ffffff_50%,rgba(255,255,255,0.45)_82%,transparent_100%)] shadow-[0_0_10px_rgba(255,255,255,0.95),0_0_3px_rgba(255,255,255,1)] dark:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_22%,rgba(255,255,255,0.82)_50%,rgba(255,255,255,0.12)_78%,transparent_100%)] dark:shadow-[0_0_8px_rgba(255,255,255,0.45),0_0_2px_rgba(255,255,255,0.6)]"
              />
            ) : null}

            <motion.span
              initial={false}
              animate={{
                y: offset === 0 ? 0 : `${offset}%`,
              }}
              transition={LETTER_SPRING}
              className="flex h-[0.5em] w-full shrink-0 items-start justify-center overflow-hidden transform-gpu"
            >
              <span
                className={cn(
                  "inline-flex min-h-[1em] min-w-[0.35em] -translate-y-[0.5em] items-start justify-center leading-none",
                  bottomClassName,
                )}
              >
                {displayChar}
              </span>
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
