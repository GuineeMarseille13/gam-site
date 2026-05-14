"use client";

import { motion } from "framer-motion";
import { Heart, Users, GraduationCap, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SectionSplitHeading } from "@/components/section-split-heading";

/** Courbe sortie douce (scroll + apparitions). */
const EASE_OUT_SMOOTH: [number, number, number, number] = [0.16, 1, 0.32, 1];

function PresentationSection() {
  const isMobile = useIsMobile();

  const features = [
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
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-blue-50/40 sm:py-6 md:py-8 dark:via-slate-950/80 dark:to-slate-900/90">
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
            headingClassName="text-4xl sm:text-5xl md:text-6xl"
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
            whileHover={{ y: -8 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
              mass: 0.75,
            }}
            className="group relative rounded-3xl border border-theme-blue/10 bg-gradient-to-br from-white via-blue-50/35 to-white p-6 backdrop-blur-sm sm:p-8 md:p-10 dark:border-theme-blue/20 dark:via-slate-900/40 dark:to-slate-950"
            style={{
              boxShadow: `
                0 4px 6px -1px rgba(0, 0, 0, 0.05),
                0 10px 15px -3px rgba(0, 0, 0, 0.08),
                0 20px 25px -5px rgba(0, 0, 0, 0.06),
                0 0 0 1px rgba(0, 0, 0, 0.02)
              `,
            }}
          >
            {/* Ombres flottantes en couches par défaut */}
            <motion.div
              className="absolute -inset-4 rounded-3xl opacity-100 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "transparent",
                boxShadow: `
                  0 20px 25px -5px rgba(0, 0, 0, 0.08),
                  0 10px 10px -5px rgba(0, 0, 0, 0.06),
                  0 0 40px rgba(0, 0, 0, 0.05),
                  0 0 60px rgba(0, 0, 0, 0.04)
                `,
                willChange: "opacity",
              }}
            />

            {/* Ombres supplémentaires pour effet de profondeur */}
            {isMobile ? null : (
              <motion.div
                className="absolute -inset-2 rounded-3xl opacity-100 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "transparent",
                  boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.12),
                  0 15px 30px -8px rgba(0, 0, 0, 0.1)
                `,
                  willChange: "opacity",
                }}
              />
            )}

            {/* Effet de brillance au survol */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-[transform,opacity] duration-[880ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-full group-hover:opacity-100 dark:via-white/15"
            />

            <p className="relative z-10 mx-auto max-w-4xl text-center text-base leading-relaxed text-slate-700 sm:text-lg md:text-xl dark:text-slate-300">
              L&apos;Association des Guinéens à Marseille (GAM) est une
              association mixte à but non lucratif qui a pour objectif de
              regrouper, informer et accompagner les Guinéens vivant à Marseille
              et ses environs. Elle œuvre principalement dans l&apos;accueil des
              nouveaux arrivants, l&apos;aide administrative, l&apos;intégration
              sociale et universitaire, ainsi que dans la valorisation de la
              culture guinéenne à travers des événements et des actions
              solidaires. GAM agit aussi comme un réseau de soutien entre
              étudiants, jeunes professionnels et familles guinéennes installées
              dans la région.
            </p>
          </motion.div>

          {/* Badges de caractéristiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: 0.32,
              duration: 0.68,
              ease: EASE_OUT_SMOOTH,
            }}
            className="mt-10 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {features.map((feature, index) => {
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
                  className="relative"
                >
                  {/* Ombres flottantes pour les badges par défaut */}
                  <motion.div
                    className={`absolute -inset-1 rounded-full opacity-100 pointer-events-none`}
                    style={{
                      background: "transparent",
                      boxShadow: `
                        0 10px 15px -3px rgba(0, 0, 0, 0.12),
                        0 4px 6px -1px rgba(0, 0, 0, 0.08)
                      `,
                    }}
                  />

                  <div
                    className={`relative flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r ${feature.color} text-white overflow-hidden`}
                    style={{
                      boxShadow: `
                        0 4px 6px -1px rgba(0, 0, 0, 0.08),
                        0 10px 15px -3px rgba(0, 0, 0, 0.06),
                        0 0 0 1px rgba(255, 255, 255, 0.1)
                      `,
                    }}
                  >
                    {/* Ombres intensifiées par défaut */}
                    <motion.div
                      className="absolute -inset-1 rounded-full opacity-100 pointer-events-none"
                      style={{
                        background: "transparent",
                        boxShadow: `
                          0 15px 25px -5px rgba(0, 0, 0, 0.15),
                          0 8px 10px -4px rgba(0, 0, 0, 0.1)
                        `,
                      }}
                    />

                    <IconComponent className="relative z-10 w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="relative z-10 text-xs sm:text-sm font-semibold whitespace-nowrap">
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
