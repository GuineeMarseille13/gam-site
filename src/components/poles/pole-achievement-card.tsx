"use client";

import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { PoleAchievementImage } from "./pole-achievement-image";
import type {
  PoleAchievementColorScheme,
  PoleAchievementImage,
} from "./pole-achievement.types";

interface PoleAchievementCardProps {
  image: PoleAchievementImage;
  index: number;
  colorScheme: PoleAchievementColorScheme;
  onOpen: () => void;
}

/**
 * Composant: PoleAchievementCard
 * Rôle: Carte cliquable d'une réalisation dans la grille publique.
 */
export function PoleAchievementCard({
  image,
  index,
  colorScheme,
  onOpen,
}: PoleAchievementCardProps) {
  const hasCaption = Boolean(image.title || image.description);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative w-full cursor-pointer overflow-hidden rounded-2xl bg-white text-left shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
        aria-label={
          image.title
            ? `Voir en grand : ${image.title}`
            : `Voir la réalisation ${index + 1}`
        }
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <PoleAchievementImage
            src={image.url}
            alt={image.title || `Réalisation ${index + 1}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span
            className={`absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-gradient-to-r ${colorScheme.primary} text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90`}
            aria-hidden
          >
            <Expand className="size-4" strokeWidth={2.5} />
          </span>
        </div>

        {hasCaption && (
          <div className="p-4 sm:p-5">
            {image.title && (
              <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                {image.title}
              </h3>
            )}
            {image.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 line-clamp-2">
                {image.description}
              </p>
            )}
          </div>
        )}
      </button>

      <div
        className={`pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r ${colorScheme.primary} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25`}
        aria-hidden
      />
    </motion.article>
  );
}
