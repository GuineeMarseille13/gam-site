/**
 * Composant Hero pour la page contacts
 */

"use client";

import { motion } from "framer-motion";
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "@/app/contacts/_config/contacts.config";

export default function ContactsHero() {
  return (
    <div className={STYLE_CONFIG.hero.wrapper}>
      <motion.h1
        {...ANIMATION_CONFIG.hero.title}
        className={STYLE_CONFIG.hero.title}
      >
        {MESSAGES.hero.title}
      </motion.h1>
      <motion.p
        {...ANIMATION_CONFIG.hero.description}
        className={STYLE_CONFIG.hero.description}
      >
        {MESSAGES.hero.description}
      </motion.p>
      <motion.div
        {...ANIMATION_CONFIG.hero.divider}
        className={STYLE_CONFIG.hero.divider}
      />
    </div>
  );
}

