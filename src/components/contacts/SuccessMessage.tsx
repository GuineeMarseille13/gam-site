/**
 * Composant pour afficher le message de succès
 */

"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "@/app/(public)/contacts/_config/contacts.config";

export default function SuccessMessage() {
  return (
    <div className={STYLE_CONFIG.success.container}>
      <motion.div
        {...ANIMATION_CONFIG.success.icon}
        className={STYLE_CONFIG.success.icon}
      >
        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
      </motion.div>
      <motion.h2
        {...ANIMATION_CONFIG.success.title}
        className={STYLE_CONFIG.success.title}
      >
        {MESSAGES.success.title}
      </motion.h2>
      <motion.p
        {...ANIMATION_CONFIG.success.message}
        className={STYLE_CONFIG.success.message}
      >
        {MESSAGES.success.message}
      </motion.p>
    </div>
  );
}

