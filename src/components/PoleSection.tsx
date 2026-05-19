"use client";

import { motion } from "framer-motion";
import { PoleCard } from "@/components/PoleCard";
import { SectionSplitHeading } from "@/components/section-split-heading";
import { getPolePublicDisplayTitle } from "@/config/pole-public-display";
import { poles as staticPoles } from "@/data/poles";
import type { PoleItem } from "@/app/_services/home";
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery";
import { slugify } from "@/lib/slugify";

interface PoleSectionProps {
  poles?: PoleItem[];
}

const PoleSection = ({ poles }: PoleSectionProps) => {
  const items =
    poles && poles.length > 0
      ? poles.map((pole, index) => {
          const slug = pole.publicSlug?.trim() || slugify(pole.name);
          const staticMatch = staticPoles.find((s) => s.slug === slug);
          const image = pole.imageId
            ? cloudinaryImageUrl(pole.imageId, "f_auto,q_auto")
            : staticMatch?.image ?? staticPoles[index % staticPoles.length].image;
          return {
            key: pole.id,
            image,
            title: getPolePublicDisplayTitle(slug, pole.name),
            description: pole.description ?? staticMatch?.shortDescription,
            slug,
            index,
          };
        })
      : staticPoles.map((pole, index) => ({
          key: pole.slug,
          image: pole.image,
          title: getPolePublicDisplayTitle(pole.slug, pole.displayTitle ?? pole.title),
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
          <SectionSplitHeading title="Nos pôles d'activités" tone="poles" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-3 max-w-3xl mx-auto text-base text-gray-600 leading-relaxed sm:mt-4 sm:text-lg"
          >
            Découvrez nos différents domaines d&apos;action et d&apos;engagement
            pour la communauté
          </motion.p>
        </motion.div>

        {/* Grille de cartes */}
        <div className="flex flex-wrap gap-4 sm:gap-4 justify-center items-stretch">
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
