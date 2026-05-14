"use client";

import { motion } from "framer-motion";
import { cn } from "@/helpers/utils";
import { TextSplit } from "@/components/ui/split-text";
import {
  SECTION_SPLIT_TONE_STYLES,
  type SectionSplitTone,
} from "@/components/section-split-heading-tones";

export type { SectionSplitTone } from "@/components/section-split-heading-tones";

/** Dégradés « haut / bas » du hero (accueil) — réutilisables hors du composant si besoin. */
export const SECTION_TITLE_SPLIT_TOP =
  SECTION_SPLIT_TONE_STYLES.hero.splitTop;
export const SECTION_TITLE_SPLIT_BOTTOM =
  SECTION_SPLIT_TONE_STYLES.hero.splitBottom;

export const SECTION_TITLE_EASE: [number, number, number, number] = [
  0.16, 1, 0.32, 1,
];

export const SECTION_TITLE_SPRING = {
  type: "spring" as const,
  stiffness: 118,
  damping: 26,
  mass: 0.92,
};

const MOTION_HEADING = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type HeadingLevel = keyof typeof MOTION_HEADING;

const HEADING_TO_SEPARATOR = "mb-2 sm:mb-2.5";

const HEADING_SIZE =
  "relative text-3xl font-extrabold tracking-tighter text-balance sm:text-4xl md:text-5xl";

export interface SectionSplitHeadingProps {
  title: string;
  as?: HeadingLevel;
  /** Palette : alignée sur le fond / le thème de la section (dégradé split, halos, filet). */
  tone?: SectionSplitTone;
  className?: string;
  headingClassName?: string;
  showAmbient?: boolean;
  showSeparator?: boolean;
}

const SECTION_SEPARATOR_WRAPPER =
  "relative mx-auto max-w-md pb-0.5 mb-5 sm:mb-6 md:mb-7 sm:max-w-lg";

export interface SectionSplitTitleSeparatorProps {
  /** Palette du filet (identique aux titres `SectionSplitHeading`). */
  tone?: SectionSplitTone;
  /** Classes fusionnées sur le conteneur du filet (marges, largeur). */
  className?: string;
}

/**
 * Filet sous-titre aligné sur `SectionSplitHeading` (halos + barre + ombres).
 * À placer juste sous le titre, avant le paragraphe ou le contenu de section.
 */
export function SectionSplitTitleSeparator({
  tone = "hero",
  className,
}: SectionSplitTitleSeparatorProps) {
  const palette = SECTION_SPLIT_TONE_STYLES[tone];

  return (
    <div className={cn(SECTION_SEPARATOR_WRAPPER, className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-2xl dark:via-white/12"
      />
      <div aria-hidden className={palette.separatorVeil} />
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.14,
          duration: 0.72,
          ease: SECTION_TITLE_EASE,
        }}
        className={cn(
          palette.separatorBar,
          palette.separatorShadow,
          palette.separatorShadowDark
        )}
      />
    </div>
  );
}

/**
 * Titre de section avec TextSplit (effet moitiés + trait blanc inter‑glyphes) et filet sous le titre.
 * Le `tone` adapte dégradés, halos et reflet du séparateur au contexte de la section.
 * Espacement : court intervalle titre → filet ; marge basse sous le filet. Sans filet : marge basse compacte sur le conteneur.
 */
export function SectionSplitHeading({
  title,
  as = "h2",
  tone = "hero",
  className,
  headingClassName,
  showAmbient = true,
  showSeparator = true,
}: SectionSplitHeadingProps) {
  const MotionHeading = MOTION_HEADING[as];
  const palette = SECTION_SPLIT_TONE_STYLES[tone];

  return (
    <div
      className={cn(
        "relative text-center",
        !showSeparator && "mb-3 sm:mb-4",
        className
      )}
    >
      {showAmbient ? (
        <>
          <div aria-hidden className={palette.ambientPrimary} />
          <div aria-hidden className={palette.ambientHighlight} />
        </>
      ) : null}

      <MotionHeading
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.06,
          ...SECTION_TITLE_SPRING,
        }}
        className={cn(
          HEADING_SIZE,
          showSeparator ? HEADING_TO_SEPARATOR : "mb-0",
          "mx-auto max-w-full px-1 sm:px-2",
          palette.headingGlow,
          palette.headingGlowDark,
          headingClassName
        )}
      >
        <TextSplit
          bottomClassName={palette.splitBottom}
          className="justify-center"
          falloff={0.22}
          maxMove={36}
          topClassName={palette.splitTop}
        >
          {title}
        </TextSplit>
      </MotionHeading>

      {showSeparator ? (
        <SectionSplitTitleSeparator tone={tone} />
      ) : null}
    </div>
  );
}
