/**
 * Composant Hero pour la page contacts
 */

"use client";

import { motion } from "framer-motion";
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "@/app/(public)/contacts/_config/contacts.config";
import { SectionSplitTitleSeparator } from "@/components/section-split-heading";
import { PageHeroMagicTitle, PAGE_HERO_SLIDER_VARIANT } from "@/components/page-hero-magic-title";

export default function ContactsHero() {
  return (
    <div className={STYLE_CONFIG.hero.wrapper}>
      <PageHeroMagicTitle text={MESSAGES.hero.title} variant={PAGE_HERO_SLIDER_VARIANT.contact} />
      <SectionSplitTitleSeparator tone="don" className="mt-2 sm:mt-3" />
      <motion.p
        {...ANIMATION_CONFIG.hero.description}
        className={STYLE_CONFIG.hero.description}
      >
        {MESSAGES.hero.description}
      </motion.p>
    </div>
  );
}

