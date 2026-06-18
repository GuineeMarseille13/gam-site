"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { getPoleAchievementImageFallback } from "@/helpers/pole-achievement-image";
import { cn } from "@/helpers/utils";

interface PoleAchievementImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Composant: PoleAchievementImage
 * Rôle: Affichage d’image réalisation avec repli ui-avatars cohérent (grille + lightbox).
 */
export function PoleAchievementImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
}: PoleAchievementImageProps) {
  const fallback = getPoleAchievementImageFallback(alt);

  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      fallback={fallback}
      fill={fill}
      width={width}
      height={height}
      className={cn(className)}
      sizes={sizes}
      priority={priority}
    />
  );
}
