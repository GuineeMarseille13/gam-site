/**
 * Composant Hero pour la page événements
 */

"use client";

import { motion } from "framer-motion";
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "@/app/evenements/_config/events.config";

interface EventsHeroProps {
  title?: string;
  description?: string;
}

export default function EventsHero({
  title = MESSAGES.hero.title,
  description = MESSAGES.hero.description,
}: EventsHeroProps) {
  return (
    <div className={STYLE_CONFIG.hero.wrapper}>
      <motion.h1
        {...ANIMATION_CONFIG.hero.title}
        className={STYLE_CONFIG.hero.title}
      >
        {title}
      </motion.h1>
      <motion.p
        {...ANIMATION_CONFIG.hero.description}
        className={STYLE_CONFIG.hero.description}
      >
        {description}
      </motion.p>
      <motion.div
        {...ANIMATION_CONFIG.hero.divider}
        className={STYLE_CONFIG.hero.divider}
      />
    </div>
  );
}

