"use client";

import { motion } from "framer-motion";
import { AssociationMagicTitle } from "@/components/association/association-magic-title";
import {
  MAGIC_HERO_PAGE_TITLE_COLOR,
  MAGIC_HERO_PAGE_TITLE_H1_LAYOUT,
  MAGIC_HERO_PAGE_TITLE_MOTION,
  MAGIC_HERO_PAGE_TITLE_TYPOGRAPHY_CLASSES,
} from "@/config/magic-hero-page-title";
import { cn } from "@/helpers/utils";

interface PageHeroMagicTitleProps {
  readonly text: string;
  readonly className?: string;
  /** Couleur du canvas MagicTextReveal (défaut : indigo, comme le hero contacts). */
  readonly magicColor?: string;
  /** Classes Tailwind du dégradé du titre (défaut : bleu / indigo / violet contacts). */
  readonly titleTypographyClassName?: string;
}

/**
 * Titre principal pleine largeur avec MagicTextReveal (variante hero, densité,
 * reset au survol). Couleurs par défaut = hero contacts ; surcharge possible
 * pour conserver la palette d’une page (adhésion, boutique, don, …).
 */
export function PageHeroMagicTitle({
  text,
  className,
  magicColor = MAGIC_HERO_PAGE_TITLE_COLOR,
  titleTypographyClassName = MAGIC_HERO_PAGE_TITLE_TYPOGRAPHY_CLASSES,
}: PageHeroMagicTitleProps) {
  return (
    <motion.h1
      {...MAGIC_HERO_PAGE_TITLE_MOTION}
      className={cn(
        titleTypographyClassName,
        MAGIC_HERO_PAGE_TITLE_H1_LAYOUT,
        className,
      )}
    >
      <AssociationMagicTitle
        text={text}
        variant="hero"
        color={magicColor}
        className={titleTypographyClassName}
      />
    </motion.h1>
  );
}
