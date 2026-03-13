/**
 * Composant réutilisable pour un bouton de réseau social
 */

"use client";

import { motion } from "framer-motion";
import { SocialNetwork } from "@/app/(public)/contacts/_types/contacts.types";
import { STYLE_CONFIG, ANIMATION_CONFIG } from "@/app/(public)/contacts/_config/contacts.config";

interface SocialButtonProps {
  social: SocialNetwork;
}

export default function SocialButton({ social }: SocialButtonProps) {
  const IconComponent = social.icon;

  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={ANIMATION_CONFIG.contactInfo.socialButton.whileHover}
      whileTap={ANIMATION_CONFIG.contactInfo.socialButton.whileTap}
      className={`${STYLE_CONFIG.contactInfo.socialButton} ${social.color}`}
      aria-label={social.label}
    >
      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium text-gray-700 whitespace-nowrap">
        {social.label}
      </span>
    </motion.a>
  );
}

