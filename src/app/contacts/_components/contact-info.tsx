"use client";

import { motion } from "framer-motion";
import { contactMethods, socialNetworks } from "../_data/contacts.data";
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "../_config/contacts.config";
import ContactMethodCard from "@/components/contacts/ContactMethodCard";
import SocialButton from "@/components/contacts/SocialButton";

export default function ContactInfo() {
  return (
    <div className="mb-8 sm:mb-12">
      {/* Méthodes de contact principales */}
      <motion.div
        {...ANIMATION_CONFIG.contactInfo.container}
        className={STYLE_CONFIG.contactInfo.grid}
      >
        {contactMethods.map((method, index) => (
          <ContactMethodCard key={method.label} method={method} index={index} />
        ))}
      </motion.div>

      {/* Réseaux sociaux */}
      <motion.div
        {...ANIMATION_CONFIG.contactInfo.social}
        className="text-center"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          {MESSAGES.social.title}
        </h3>
        <div className={STYLE_CONFIG.contactInfo.socialGrid}>
          {socialNetworks.map((social) => (
            <SocialButton key={social.label} social={social} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

