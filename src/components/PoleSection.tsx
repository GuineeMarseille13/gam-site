"use client";

import { motion } from "framer-motion";
import { PoleCard } from "@/components/PoleCard";

const PoleSection = () => {
  const poles = [
    {
      image: "/images/e-pole.jpg",
      title: "EVENEMENTIEL",
      description:
        "Organisation d'événements culturels, festifs et caritatifs pour rassembler la communauté.",
    },
    {
      image: "/images/aa-pole.jpg",
      title: "DEMARCHE ADMINISTRATIVE",
      description:
        "Accompagnement et assistance dans vos démarches administratives et vos formalités.",
    },
    {
      image: "/images/mr-pole.jpg",
      title: "MISE EN RELATION",
      description:
        "Facilitation des échanges et des connexions entre les membres de la communauté.",
    },
  ];

  return (
    <section className="w-full py-5 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center sm:mb-12 md:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Nos pôles d&apos;activités
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
          >
            Découvrez nos différents domaines d&apos;action et d&apos;engagement
            pour la communauté
          </motion.p>
        </motion.div>

        {/* Grille de cartes */}
        <div className="flex flex-wrap gap-6 sm:gap-8 justify-center items-stretch">
          {poles.map((pole, index) => (
            <PoleCard
              key={pole.title}
              image={pole.image}
              title={pole.title}
              description={pole.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoleSection;
