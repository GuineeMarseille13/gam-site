"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
  /**
   * Désactive translate + scale au survol (ex. carrousel avec `overflow-hidden`)
   * pour éviter de rogner la carte et les halos `-inset-2`.
   */
  disableHoverLift?: boolean;
}

/**
 * Component: PartnerCard
 * Rôle: Présenter un partenaire ; titre, description et CTA alignés sur `PoleCard`.
 */
export function PartnerCard({
  id,
  name,
  logo,
  description,
  website,
  accentGradientClassName = "from-blue-500 via-indigo-500 to-purple-500",
  disableHoverLift = false,
}: PartnerCardProps) {
  const hasWebsite = typeof website === "string" && website.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      {...(disableHoverLift
        ? {}
        : {
            whileHover: { y: -8, scale: 1.02 },
          })}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative min-w-0 w-full"
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
        className="relative h-[420px] w-full min-w-0 sm:h-[450px] overflow-hidden rounded-xl border border-gray-200/60 bg-white transition-all duration-500"
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

          {/* Contenu — mêmes styles titre / description / action que `PoleCard` */}
          <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-white to-gray-50/50 p-5 sm:p-6">
            <div>
              <motion.h3
                id={`partner-${id}-title`}
                className="mb-2 min-w-0 break-words bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-xl font-extrabold text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 sm:mb-3 sm:text-2xl"
              >
                {name}
              </motion.h3>
              {description ? (
                <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {description}
                </p>
              ) : null}
            </div>

            {hasWebsite ? (
              <motion.a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-blue-600 transition-colors duration-300 group-hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label={`Visiter le site de ${name}`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-sm font-semibold">Visiter le site</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-gray-400">
                <span className="text-sm font-semibold">Site non disponible</span>
              </div>
            )}
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
