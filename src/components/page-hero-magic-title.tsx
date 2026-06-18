"use client"

import { motion } from "framer-motion"

import { DynamicTextSliderTitle } from "@/components/ui/dynamic-text-slider"
import {
  PAGE_HERO_SLIDER_VARIANT,
  type PageHeroSliderVariant,
} from "@/config/page-hero-slider-theme"
import {
  PAGE_HERO_TITLE_H1_LAYOUT,
  PAGE_HERO_TITLE_MOTION,
} from "@/config/page-hero-title"
import { cn } from "@/helpers/utils"

interface PageHeroMagicTitleProps {
  readonly text: string
  readonly variant?: PageHeroSliderVariant
  readonly className?: string
}

/**
 * Titre principal de page avec slider de texte incliné (Contacts, adhésion, boutique, don, …).
 */
export function PageHeroMagicTitle({
  text,
  variant = PAGE_HERO_SLIDER_VARIANT.association,
  className,
}: PageHeroMagicTitleProps) {
  return (
    <motion.h1
      {...PAGE_HERO_TITLE_MOTION}
      className={cn(PAGE_HERO_TITLE_H1_LAYOUT, className)}
    >
      <DynamicTextSliderTitle text={text} variant={variant} />
    </motion.h1>
  )
}

export { PAGE_HERO_SLIDER_VARIANT, type PageHeroSliderVariant }
