"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PoleAchievementCard } from "./pole-achievement-card";
import { PoleAchievementLightbox } from "./pole-achievement-lightbox";
import type {
  PoleAchievementColorScheme,
  PoleAchievementImage,
} from "./pole-achievement.types";

interface PoleAchievementsSectionProps {
  images: PoleAchievementImage[];
  colorScheme: PoleAchievementColorScheme;
  introOverride?: string | null;
  defaultSubtitle: string;
}

/**
 * Composant: PoleAchievementsSection
 * Rôle: Section publique « Nos réalisations » avec grille responsive et lightbox.
 */
export function PoleAchievementsSection({
  images,
  colorScheme,
  introOverride,
  defaultSubtitle,
}: PoleAchievementsSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const subtitle = introOverride?.trim() || defaultSubtitle;

  const handleOpen = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleChangeIndex = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20 md:mb-28"
      aria-labelledby="pole-achievements-heading"
    >
      <header className="mb-10 text-center md:mb-14">
        <motion.h2
          id="pole-achievements-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl"
        >
          Nos Réalisations
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mb-6 max-w-3xl whitespace-pre-wrap text-lg font-medium text-gray-600 md:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
          aria-hidden
        />
      </header>

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {images.map((image, index) => (
            <PoleAchievementCard
              key={`${image.url}-${index}`}
              image={image}
              index={index}
              colorScheme={colorScheme}
              onOpen={() => handleOpen(index)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedIndex !== null && (
          <PoleAchievementLightbox
            key="pole-achievement-lightbox"
            images={images}
            activeIndex={selectedIndex}
            onClose={handleClose}
            onChangeIndex={handleChangeIndex}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
