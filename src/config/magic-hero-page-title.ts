/**
 * Styles des titres hero « MagicTextReveal » : défaut contacts (indigo),
 * variantes adhésion/boutique (ambre / jaune / citron) et don (rose / rouge).
 * La typo responsive reste gérée par `useMagicTextRevealTypography("hero")` dans `AssociationMagicTitle`.
 */

/** Couleur canvas MagicTextReveal (indigo), alignée sur le hero contacts. */
export const MAGIC_HERO_PAGE_TITLE_COLOR = "rgb(79 70 229)" as const;

/** Classes Tailwind du titre (dégradé + breakpoints), identiques au hero contacts. */
export const MAGIC_HERO_PAGE_TITLE_TYPOGRAPHY_CLASSES =
  "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent" as const;

/** Layout du `<h1>` : centrage et gouttières comme sur la page contacts. */
export const MAGIC_HERO_PAGE_TITLE_H1_LAYOUT =
  "flex w-full min-w-0 justify-center px-1 sm:px-2" as const;

/** Animation d’entrée du `<h1>` (Framer Motion), alignée sur `ANIMATION_CONFIG.hero.title` contacts. */
export const MAGIC_HERO_PAGE_TITLE_MOTION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
} as const;

/** Adhésion & boutique — dégradé ambre / jaune / citron (titres d’origine). */
export const MAGIC_HERO_MEMBERSHIP_SHOP_TYPOGRAPHY_CLASSES =
  "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent" as const;

/** Canvas MagicTextReveal : jaune-500 (cœur du dégradé ambre / jaune / citron). */
export const MAGIC_HERO_MEMBERSHIP_SHOP_COLOR = "rgb(234 179 8)" as const;

/** Don — dégradé rose / framboise / rouge (titre d’origine). */
export const MAGIC_HERO_DONATION_TYPOGRAPHY_CLASSES =
  "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent" as const;

/** Canvas MagicTextReveal : rose-500 (cœur du dégradé don). */
export const MAGIC_HERO_DONATION_COLOR = "rgb(244 63 94)" as const;
