"use client";

import { motion } from "framer-motion";
import { Heart, Users, GraduationCap, Globe } from "lucide-react";
import { SectionSplitHeading } from "@/components/section-split-heading";

/** Courbe sortie douce (scroll + apparitions). */
const EASE_OUT_SMOOTH: [number, number, number, number] = [0.16, 1, 0.32, 1];

const FEATURES = [
  {
    icon: Users,
    text: "Réseau de soutien",
    color: "from-theme-blue-dark to-theme-blue",
  },
  {
    icon: GraduationCap,
    text: "Intégration universitaire",
    color: "from-theme-blue to-sky-400",
  },
  {
    icon: Globe,
    text: "Culture guinéenne",
    color: "from-sky-500 to-theme-blue",
  },
  {
    icon: Heart,
    text: "Actions solidaires",
    color: "from-indigo-600 to-theme-blue-light",
  },
] as const;

const CARD_SHADOW =
  "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)";

const BADGE_SHADOW =
  "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.1)";

function PresentationSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-blue-50/40 py-8 sm:py-6 md:py-8 dark:via-slate-950/80 dark:to-slate-900/90">
      {/* Voile radial froid (profondeur douce) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,color-mix(in_srgb,var(--theme-blue)_10%,transparent),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_42%,color-mix(in_srgb,var(--theme-blue)_16%,transparent),transparent_55%)]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.58, ease: EASE_OUT_SMOOTH }}
          className="relative text-center"
        >
          <SectionSplitHeading
            as="h1"
            headingClassName="text-3xl sm:text-5xl md:text-6xl"
            title="Bienvenue"
          />
        </motion.div>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            delay: 0.22,
            duration: 0.68,
            ease: EASE_OUT_SMOOTH,
          }}
          className="relative"
        >
          {/* Carte principale avec effet de flottement */}
          <motion.div
            className="group relative rounded-2xl border border-theme-blue/10 bg-gradient-to-br from-white via-blue-50/35 to-white p-5 backdrop-blur-sm transition-transform duration-300 ease-out sm:rounded-3xl sm:p-8 sm:hover:-translate-y-2 md:p-10 dark:border-theme-blue/20 dark:via-slate-900/40 dark:to-slate-950"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <motion.div
              className="pointer-events-none absolute -inset-4 hidden rounded-3xl opacity-100 transition-opacity duration-500 group-hover:opacity-100 sm:block"
              style={{
                background: "transparent",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.06), 0 0 40px rgba(0, 0, 0, 0.05), 0 0 60px rgba(0, 0, 0, 0.04)",
                willChange: "opacity",
              }}
            />

            <motion.div
              className="pointer-events-none absolute -inset-2 hidden rounded-3xl opacity-100 transition-opacity duration-500 group-hover:opacity-100 sm:block"
              style={{
                background: "transparent",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 15px 30px -8px rgba(0, 0, 0, 0.1)",
                willChange: "opacity",
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-[transform,opacity] duration-[880ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-full group-hover:opacity-100 sm:rounded-3xl dark:via-white/15"
            />

            <div className="relative z-10 mx-auto max-w-4xl space-y-4 text-center sm:space-y-5">
              <p className="text-[15px] leading-7 text-slate-700 sm:text-lg sm:leading-relaxed md:text-xl dark:text-slate-300">
                L&apos;Association des Guinéens à Marseille (GAM) est une association mixte à
                but non lucratif qui regroupe, informe et accompagne les Guinéens vivant à
                Marseille et ses environs.
              </p>
              <p className="text-[15px] leading-7 text-slate-600 sm:text-lg sm:leading-relaxed md:text-xl dark:text-slate-400">
                Accueil des nouveaux arrivants, aide administrative, intégration sociale et
                universitaire, valorisation de la culture guinéenne et actions solidaires :
                GAM est un réseau de soutien pour étudiants, jeunes professionnels et familles
                guinéennes de la région.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: 0.32,
              duration: 0.68,
              ease: EASE_OUT_SMOOTH,
            }}
            className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-6"
          >
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.42 + index * 0.08,
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    mass: 0.72,
                  }}
                  className="relative w-full lg:w-auto"
                >
                  <div
                    className={`relative flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r px-4 py-3 text-white ${feature.color} sm:justify-start sm:px-5 sm:py-3 lg:w-auto`}
                    style={{ boxShadow: BADGE_SHADOW }}
                  >
                    <IconComponent className="relative z-10 size-4 shrink-0 sm:size-5" />
                    <span className="relative z-10 text-sm font-semibold leading-snug sm:text-sm">
                      {feature.text}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default PresentationSection;
