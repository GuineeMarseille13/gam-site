"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface PartnerCardProps {
  /** Identifiant unique du partenaire */
  id: number;
  /** Nom du partenaire (affiché en titre) */
  name: string;
  /** URL du logo (Image optimisée Next.js) */
  logo: string;
  /** Description courte (optionnelle) */
  description?: string;
  /** URL du site web (optionnelle) */
  website?: string;
  /** Accent de couleur tailwind arbitraire (ex: 'from-theme-red to-theme-yellow') */
  accentGradientClassName?: string;
}

/**
 * Component: PartnerCard
 * Rôle: Présenter un partenaire avec un design distinct des produits
 * Spécificités UI: accent diagonal, fond doux, badge catégorie, CTA site web,
 *                  hover animé (scale, subtle tilt), focus a11y, ligne d’accent.
 */
export function PartnerCard({
  id,
  name,
  logo,
  description,
  website,
  accentGradientClassName = "from-theme-red via-theme-yellow to-theme-green",
}: PartnerCardProps) {
  const hasWebsite = typeof website === "string" && website.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group"
    >
      <Card
        className="relative h-80 overflow-hidden border-gray-200 bg-white shadow-sm transition-all duration-500 hover:shadow-lg"
        aria-labelledby={`partner-${id}-title`}
      >
        {/* Accent diagonal */}
        <div className={`absolute -top-24 -right-24 h-64 w-64 rotate-45 bg-gradient-to-r ${accentGradientClassName} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

        <CardContent className="p-0 h-full flex flex-col">
          {/* Zone logo */}
          <div className="relative h-44 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className={`h-1 w-24 bg-gradient-to-r ${accentGradientClassName} rounded-full absolute left-1/2 -translate-x-1/2 bottom-0`} />
            </div>

            <motion.div
              className="relative w-full h-full p-6"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <Image
                src={logo}
                alt={`Logo ${name}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            </motion.div>
          </div>

          {/* Contenu */}
          <div className="flex-1 p-5 flex flex-col gap-3">
            <h3
              id={`partner-${id}-title`
              }
              className="text-lg font-semibold text-gray-900 tracking-tight"
            >
              {name}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {description}
              </p>
            )}

            {/* CTA */}
            <div className="mt-auto pt-2">
              {hasWebsite ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={`Visiter le site de ${name}`}
                >
                  <span>Visiter le site</span>
                  <span aria-hidden>↗</span>
                </a>
              ) : (
                <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
                  Site non disponible
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export interface PartnerCardData {
  id: number;
  name: string;
  logo: string;
  description?: string;
  website?: string;
}


