/**
 * Données de contact
 * À remplacer par vos données réelles
 */

import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { ContactMethod, SocialNetwork } from "../_types/contacts.types";
import { TikTokIcon } from "@/components/contacts/TikTokIcon";

export const contactMethods: ContactMethod[] = [
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

export const socialNetworks: SocialNetwork[] = [
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://facebook.com/gam-association",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/gam_association",
    color: "from-pink-500 via-purple-500 to-orange-500",
  },
  {
    icon: TikTokIcon,
    label: "TikTok",
    href: "https://tiktok.com/@gam_association",
    color: "from-black to-gray-800",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/company/gam-association",
    color: "from-blue-600 to-blue-700",
  },
];

