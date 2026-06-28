"use client";

import { PartnerCardDescription } from "@/components/partner-card-description";
import { cn } from "@/helpers/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
   * Carrousel : conserve ombres / bordures / survols internes,
   * désactive uniquement le lift (translate + scale) pour éviter le rognage.
   */
  disableHoverLift?: boolean;
}

const CARD_SHELL_SHADOW = `
  0 4px 6px -1px rgba(0, 0, 0, 0.05),
  0 10px 15px -3px rgba(0, 0, 0, 0.08),
  0 20px 25px -5px rgba(0, 0, 0, 0.06),
  0 0 0 1px rgba(0, 0, 0, 0.02)
`;

const FLOAT_SHADOW = `
  0 20px 25px -5px rgba(0, 0, 0, 0.08),
  0 10px 10px -5px rgba(0, 0, 0, 0.06),
  0 0 40px rgba(0, 0, 0, 0.05)
`;

const HOVER_GLOW_SHADOW = `
  0 5px 10px 0px rgba(59, 130, 246, 0.15),
  0 5px 10px 0px rgba(59, 130, 246, 0.1),
  0 0 5px rgba(147, 51, 234, 0.2)
`;

const INNER_PANEL_SHADOW = `
  0 1px 3px 0 rgba(0, 0, 0, 0.05),
  0 4px 6px -1px rgba(0, 0, 0, 0.06),
  0 10px 15px -3px rgba(0, 0, 0, 0.08)
`;

/**
 * Component: PartnerCard
 * Rôle: Présenter un partenaire ; structure visuelle alignée sur `PoleCard`.
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...(disableHoverLift
        ? {}
        : {
            whileHover: { y: -12, scale: 1.02 },
          })}
      className="group relative h-full min-w-0 w-full"
    >
      <div
        className="pointer-events-none absolute -inset-2 hidden rounded-2xl opacity-100 sm:block"
        style={{ background: "transparent", boxShadow: FLOAT_SHADOW }}
        aria-hidden
      />

      <div
        className={cn(
          "relative h-auto w-full min-w-0 sm:h-[450px]",
          "rounded-2xl",
          "bg-gradient-to-br from-white via-gray-50 to-white",
          "border border-gray-200/60 transition-all duration-500 ease-out",
          "group-hover:border-transparent",
        )}
        style={{ boxShadow: CARD_SHELL_SHADOW }}
        aria-labelledby={`partner-${id}-title`}
      >
        <div
          className="pointer-events-none absolute -inset-2 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "transparent", boxShadow: HOVER_GLOW_SHADOW }}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
        </div>

        <div
          className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white"
          style={{ boxShadow: INNER_PANEL_SHADOW }}
        >
          <div
            className={cn(
              "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rotate-45 bg-gradient-to-r opacity-5 transition-opacity duration-500 group-hover:opacity-10",
              accentGradientClassName,
            )}
            aria-hidden
          />

          <div
            className={cn(
              "relative w-full shrink-0 overflow-hidden transition-[height] duration-300 ease-out",
              isDescriptionExpanded
                ? "h-[160px] sm:h-[192px]"
                : "aspect-[16/10] sm:aspect-auto sm:h-[240px]",
            )}
          >
            {logo ? (
              <motion.div
                className="absolute inset-0 h-full w-full"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image
                  src={logo}
                  alt={`Logo ${name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 400px, 420px"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-6xl font-bold text-gray-300">
                  {name[0]}
                </span>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col justify-between overflow-hidden p-5 transition-colors duration-300 sm:p-6",
              isDescriptionExpanded
                ? "bg-gradient-to-b from-white to-blue-50/30"
                : "bg-gradient-to-b from-white to-gray-50/50",
            )}
          >
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-hidden",
                isDescriptionExpanded ? "gap-1.5" : "gap-2",
              )}
            >
              <h3
                id={`partner-${id}-title`}
                className="min-w-0 shrink-0 break-words bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-lg font-extrabold text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 sm:text-2xl"
              >
                {name}
              </h3>
              {description ? (
                <PartnerCardDescription
                  description={description}
                  partnerId={id}
                  onExpandedChange={setIsDescriptionExpanded}
                />
              ) : null}
            </div>

            {hasWebsite ? (
              <motion.a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-[44px] shrink-0 items-center gap-2 text-blue-600 transition-colors duration-300 group-hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:mt-4"
                aria-label={`Visiter le site de ${name}`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-sm font-semibold">Visiter le site</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            ) : (
              <div className="mt-3 flex min-h-[44px] shrink-0 items-center gap-2 text-gray-400 sm:mt-4">
                <span className="text-sm font-semibold">Site non disponible</span>
              </div>
            )}
          </div>

          <div
            className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
            aria-hidden
          />
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
