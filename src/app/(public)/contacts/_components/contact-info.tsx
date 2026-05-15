"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  STYLE_CONFIG,
  ANIMATION_CONFIG,
  MESSAGES,
  CONTACT_METHOD_ICON_COLOR,
} from "../_config/contacts.config";
import { ContactMethod, SocialNetwork, DbContact, DbSocialMedia } from "../_types/contacts.types";
import ContactMethodCard from "@/components/contacts/ContactMethodCard";
import SocialButton from "@/components/contacts/SocialButton";
import { SocialIcon } from "@/components/SocialIcon";
import { SOCIAL_PLATFORM_CONFIG, detectPlatform } from "@/helpers/social-media-config";

// ── Fallback (si la DB est vide) ─────────────────────────────────────────────

const FALLBACK_METHODS: ContactMethod[] = [
  {
    icon: Mail,
    label: "Email",
    value: "guineeamarseille13@gmail.com",
    href: "mailto:guineeamarseille13@gmail.com",
    color: CONTACT_METHOD_ICON_COLOR,
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+33 7 67 13 39 28",
    href: "tel:+33767133928",
    color: CONTACT_METHOD_ICON_COLOR,
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "2 Boulevard Louis Frangin, 13005 Marseille",
    color: CONTACT_METHOD_ICON_COLOR,
  },
];

// ── Builder functions ─────────────────────────────────────────────────────────

function buildContactMethods(contact: DbContact): ContactMethod[] {
  const methods: ContactMethod[] = [];
  if (contact.email) {
    methods.push({
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: CONTACT_METHOD_ICON_COLOR,
    });
  }
  if (contact.phone) {
    methods.push({
      icon: Phone,
      label: "Téléphone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      color: CONTACT_METHOD_ICON_COLOR,
    });
  }
  if (contact.address) {
    methods.push({
      icon: MapPin,
      label: "Adresse",
      value: [contact.address, contact.zipCode, contact.city].filter(Boolean).join(", "),
      color: CONTACT_METHOD_ICON_COLOR,
    });
  }
  return methods;
}

function buildSocialNetworks(socialMedias: DbSocialMedia[]): SocialNetwork[] {
  return socialMedias.map((sm) => {
    const platform = detectPlatform(sm.icon, sm.name);
    const gradient = platform
      ? SOCIAL_PLATFORM_CONFIG[platform].gradient
      : "from-gray-500 to-gray-600";

    // SocialButton attend un composant React en prop `icon`
    const IconComponent = ({ className }: { className?: string }) => (
      <SocialIcon icon={sm.icon} name={sm.name} className={className} />
    );

    return { icon: IconComponent, label: sm.name, href: sm.url, color: gradient };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ContactInfoProps {
  contact: DbContact | null;
  socialMedias: DbSocialMedia[];
}

export default function ContactInfo({ contact, socialMedias }: ContactInfoProps) {
  const methods = contact ? buildContactMethods(contact) : FALLBACK_METHODS;
  const networks = socialMedias.length > 0 ? buildSocialNetworks(socialMedias) : [];

  return (
    <div className="flex w-full min-w-0 flex-col items-center mb-8 sm:mb-12">
      <motion.div
        {...ANIMATION_CONFIG.contactInfo.container}
        className={STYLE_CONFIG.contactInfo.grid}
      >
        {methods.map((method) => (
          <ContactMethodCard key={method.label} method={method} />
        ))}
      </motion.div>

      {networks.length > 0 && (
        <motion.div
          {...ANIMATION_CONFIG.contactInfo.social}
          className="text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {MESSAGES.social.title}
          </h3>
          <div className={STYLE_CONFIG.contactInfo.socialGrid}>
            {networks.map((social) => (
              <SocialButton key={social.label} social={social} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
