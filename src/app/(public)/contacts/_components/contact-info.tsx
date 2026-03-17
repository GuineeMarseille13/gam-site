"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Globe } from "lucide-react";
import { TikTokIcon } from "@/components/contacts/TikTokIcon";
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "../_config/contacts.config";
import { ContactMethod, SocialNetwork, DbContact, DbSocialMedia } from "../_types/contacts.types";
import ContactMethodCard from "@/components/contacts/ContactMethodCard";
import SocialButton from "@/components/contacts/SocialButton";

// ── Fallback data (used when DB has no records yet) ──────────────────────────

const FALLBACK_METHODS: ContactMethod[] = [
  {
    icon: Mail,
    label: "Email",
    value: "guineeamarseille13@gmail.com",
    href: "mailto:guineeamarseille13@gmail.com",
    color: "from-blue-100 to-indigo-100 text-blue-700",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+33 7 67 13 39 28",
    href: "tel:+33767133928",
    color: "from-green-100 to-emerald-100 text-green-700",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "2 Boulevard Louis Frangin, 13005 Marseille",
    color: "from-amber-100 to-yellow-100 text-amber-700",
  },
];

const FALLBACK_SOCIALS: SocialNetwork[] = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/gam-association", color: "from-blue-500 to-blue-600" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/gam_association", color: "from-pink-500 via-purple-500 to-orange-500" },
  { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com/@gam_association", color: "from-black to-gray-800" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/gam-association", color: "from-blue-600 to-blue-700" },
];

// ── Icon & color mapping from DB icon identifier ─────────────────────────────

function getSocialIcon(iconKey: string | null, name: string) {
  const key = (iconKey ?? name).toLowerCase();
  if (key.includes("facebook")) return Facebook;
  if (key.includes("instagram")) return Instagram;
  if (key.includes("tiktok")) return TikTokIcon;
  if (key.includes("linkedin")) return Linkedin;
  return Globe;
}

function getSocialColor(iconKey: string | null, name: string) {
  const key = (iconKey ?? name).toLowerCase();
  if (key.includes("facebook")) return "from-blue-500 to-blue-600";
  if (key.includes("instagram")) return "from-pink-500 via-purple-500 to-orange-500";
  if (key.includes("tiktok")) return "from-black to-gray-800";
  if (key.includes("linkedin")) return "from-blue-600 to-blue-700";
  return "from-gray-500 to-gray-600";
}

// ── Builder functions ─────────────────────────────────────────────────────────

function buildContactMethods(contact: DbContact): ContactMethod[] {
  const methods: ContactMethod[] = [];

  if (contact.email) {
    methods.push({
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: "from-blue-100 to-indigo-100 text-blue-700",
    });
  }
  if (contact.phone) {
    const raw = contact.phone.replace(/\s/g, "");
    methods.push({
      icon: Phone,
      label: "Téléphone",
      value: contact.phone,
      href: `tel:${raw}`,
      color: "from-green-100 to-emerald-100 text-green-700",
    });
  }
  if (contact.address) {
    const fullAddress = [contact.address, contact.zipCode, contact.city]
      .filter(Boolean)
      .join(", ");
    methods.push({
      icon: MapPin,
      label: "Adresse",
      value: fullAddress,
      color: "from-amber-100 to-yellow-100 text-amber-700",
    });
  }

  return methods;
}

function buildSocialNetworks(socialMedias: DbSocialMedia[]): SocialNetwork[] {
  return socialMedias.map((sm) => ({
    icon: getSocialIcon(sm.icon, sm.name),
    label: sm.name,
    href: sm.url,
    color: getSocialColor(sm.icon, sm.name),
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ContactInfoProps {
  contact: DbContact | null;
  socialMedias: DbSocialMedia[];
}

export default function ContactInfo({ contact, socialMedias }: ContactInfoProps) {
  const methods = contact ? buildContactMethods(contact) : FALLBACK_METHODS;
  const networks = socialMedias.length > 0 ? buildSocialNetworks(socialMedias) : FALLBACK_SOCIALS;

  return (
    <div className="mb-8 sm:mb-12">
      <motion.div
        {...ANIMATION_CONFIG.contactInfo.container}
        className={STYLE_CONFIG.contactInfo.grid}
      >
        {methods.map((method, index) => (
          <ContactMethodCard key={method.label} method={method} index={index} />
        ))}
      </motion.div>

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
    </div>
  );
}
