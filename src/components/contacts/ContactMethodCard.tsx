/**
 * Composant réutilisable pour une carte de méthode de contact
 */

"use client";

import { motion } from "framer-motion";
import { ContactMethod } from "@/app/(public)/contacts/_types/contacts.types";
import { STYLE_CONFIG, ANIMATION_CONFIG } from "@/app/(public)/contacts/_config/contacts.config";

interface ContactMethodCardProps {
  method: ContactMethod;
  index: number;
}

export default function ContactMethodCard({ method, index }: ContactMethodCardProps) {
  const IconComponent = method.icon;

  return (
    <motion.a
      href={method.href}
      target={method.href?.startsWith("http") ? "_blank" : undefined}
      rel={method.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      whileHover={ANIMATION_CONFIG.contactInfo.card.whileHover}
      className={STYLE_CONFIG.contactInfo.card}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${STYLE_CONFIG.contactInfo.icon} ${method.color}`}>
          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5">
          {method.label}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {method.value}
        </p>
      </div>
    </motion.a>
  );
}

