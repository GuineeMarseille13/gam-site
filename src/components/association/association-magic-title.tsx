"use client";

import { MagicTextReveal } from "@/components/ui/magic-text-reveal";
import { useMagicTextRevealTypography, type MagicTextRevealVariant } from "@/hooks/use-magic-text-reveal-typography";

const FONT_FAMILY = "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif";

/** Vert aligné sur `green-600` / `theme-green` (syntaxe classique pour styles React cohérents SSR/client). */
export const ASSOCIATION_MAGIC_TITLE_GREEN = "rgb(22, 163, 74)";

interface AssociationMagicTitleProps {
  readonly text: string;
  readonly color?: string;
  /** hero | section | display — voir getMagicTextRevealTypography */
  readonly variant?: MagicTextRevealVariant;
  readonly className?: string;
}

/**
 * Titre MagicTextReveal : mêmes paramètres que le hero contacts (police, vitesse, densité, reset),
 * fond transparent pour les sections association.
 */
export function AssociationMagicTitle({
  text,
  color = ASSOCIATION_MAGIC_TITLE_GREEN,
  variant = "section",
  className = "",
}: AssociationMagicTitleProps) {
  const typography = useMagicTextRevealTypography(variant);

  return (
    <MagicTextReveal
      text={text}
      className={className}
      color={color}
      fontSize={typography.fontSize}
      fontFamily={FONT_FAMILY}
      fontWeight={700}
      spread={typography.spread}
      titleLayout={variant}
      speed={0.5}
      density={4}
      resetOnMouseLeave
      style={{
        backgroundColor: "transparent",
        border: "none",
        backdropFilter: "none",
        maxWidth: "none",
      }}
    />
  );
}
