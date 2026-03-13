"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PartnerCardProps {
  /** Identifiant unique du partenaire */
  id: number;
  /** Nom du partenaire (affiché en titre) */
  name: string;
  /** URL du logo (Image optimisée Next.js) */
  logo?: string;
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
  accentGradientClassName = "from-blue-500 via-indigo-500 to-purple-500",
}: PartnerCardProps) {
  const hasWebsite = typeof website === "string" && website.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative"
    >
      {/* Ombres flottantes en couches */}
      <motion.div
        className="absolute -inset-2 rounded-2xl opacity-100 pointer-events-none"
        style={{
          background: "transparent",
          boxShadow: `
            0 20px 25px -5px rgba(0, 0, 0, 0.08),
            0 10px 10px -5px rgba(0, 0, 0, 0.06),
            0 0 40px rgba(0, 0, 0, 0.05),
            0 0 60px rgba(0, 0, 0, 0.04)
          `,
        }}
      />

      <div
        className="relative h-[420px] sm:h-[450px] overflow-hidden rounded-xl border border-gray-200/60 bg-white transition-all duration-500"
        style={{
          boxShadow: `
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 10px 15px -3px rgba(0, 0, 0, 0.08),
            0 20px 25px -5px rgba(0, 0, 0, 0.06)
          `,
        }}
        aria-labelledby={`partner-${id}-title`}
      >
        {/* Accent diagonal */}
        <div
          className={`absolute -top-24 -right-24 h-64 w-64 rotate-45 bg-gradient-to-r ${accentGradientClassName} opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
        />

        {/* Effet de brillance au survol */}
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

        <div className="h-full flex flex-col">
          {/* Zone image */}
          <div className="relative w-full h-[280px] overflow-hidden">
            {logo ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={logo}
                  alt={`Logo ${name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={false}
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-6xl font-bold text-gray-300">
                  {name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 p-5 flex flex-col gap-3">
            <h3
              id={`partner-${id}-title`}
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
                <motion.a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group/btn inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-300/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label={`Visiter le site de ${name}`}
                >
                  <span>Visiter le site</span>
                  <motion.span
                    aria-hidden
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    ↗
                  </motion.span>
                </motion.a>
              ) : (
                <span className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2.5 text-xs font-medium text-gray-500">
                  Site non disponible
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export interface PartnerCardData {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
}
