"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { cn } from "@/helpers/utils";

import { popupImageLoader } from "./popup-image";
import type { SlideDirection } from "./use-prospectus-carousel";

interface ProspectusSlideProps {
  imageId: string;
  alt: string;
  direction: SlideDirection;
  hasProgress: boolean;
}

const slideVariants = {
  enter: (dir: SlideDirection) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] as const } },
  exit: (dir: SlideDirection) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.35, ease: "easeIn" as const },
  }),
};

/**
 * Composant: ProspectusSlide
 * Rôle: Afficher un prospectus en entier (object-contain) dans le cadre fixe,
 * les marges étant comblées par une version floutée de la même image.
 */
export function ProspectusSlide({ imageId, alt, direction, hasProgress }: ProspectusSlideProps) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0"
    >
      <Image
        loader={popupImageLoader}
        src={imageId}
        alt=""
        aria-hidden
        fill
        sizes="64px"
        className="scale-110 object-cover opacity-70 blur-2xl"
      />
      <div className={cn("absolute inset-x-3 bottom-3", hasProgress ? "top-8" : "top-3")}>
        <Image
          loader={popupImageLoader}
          src={imageId}
          alt={alt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 34rem"
          className="object-contain drop-shadow-2xl"
        />
      </div>
    </motion.div>
  );
}
