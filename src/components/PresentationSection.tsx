"use client";

import { motion } from "framer-motion";
import { Heart, Users, GraduationCap, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
const PresentationSection = () => {
  const isMobile = useIsMobile();

  const features = [
    {
      icon: Users,
      text: "Réseau de soutien",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: GraduationCap,
      text: "Intégration universitaire",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      text: "Culture guinéenne",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Heart,
      text: "Actions solidaires",
      color: "from-red-500 to-rose-500",
    },
  ];

  return (
    <section className="w-full sm:py-6 md:py-8 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Effet de fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Bienvenue
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mb-6"
          />
        </motion.div>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          {/* Carte principale avec effet de flottement */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative rounded-3xl bg-gradient-to-br from-white via-gray-50/80 to-white p-6 sm:p-8 md:p-10 border border-gray-200/60 backdrop-blur-sm"
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
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-3xl opacity-0 hover:opacity-100 pointer-events-none" />

            <p className="relative text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto z-10">
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
            transition={{ delay: 0.4, duration: 0.5 }}
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
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
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
};

export default PresentationSection;
