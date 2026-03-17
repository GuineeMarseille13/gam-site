"use client";

import { motion } from "framer-motion";
import { PoleCard } from "@/components/PoleCard";
import { poles as staticPoles } from "@/data/poles";
import type { PoleItem } from "@/app/_services/home";

const CLOUDINARY_BASE = "https://res.cloudinary.com/df3ymbrqe/image/upload";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface PoleSectionProps {
  poles?: PoleItem[];
}

const PoleSection = ({ poles }: PoleSectionProps) => {
  const items =
    poles && poles.length > 0
      ? poles.map((pole, index) => {
          const slug = slugify(pole.name);
          const staticMatch = staticPoles.find((s) => s.slug === slug);
          const image = pole.imageId
            ? `${CLOUDINARY_BASE}/f_auto,q_auto/${pole.imageId}`
            : staticMatch?.image ?? staticPoles[index % staticPoles.length].image;
          return {
            key: pole.id,
            image,
            title: pole.name,
            description: pole.description ?? staticMatch?.shortDescription,
            slug,
            index,
          };
        })
      : staticPoles.map((pole, index) => ({
          key: pole.slug,
          image: pole.image,
          title: pole.title,
          description: pole.shortDescription,
          slug: pole.slug,
          index,
        }));

  return (
    <section
      id="poles"
      className="w-full py-5 sm:py-8 md:py-10 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center sm:mb-8 md:mb-10"
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
          {items.map((item) => (
            <PoleCard
              key={item.key}
              image={item.image}
              title={item.title}
              description={item.description}
              slug={item.slug}
              index={item.index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoleSection;
