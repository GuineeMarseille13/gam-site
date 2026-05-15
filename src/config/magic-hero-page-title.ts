/**
 * Styles des titres hero « MagicTextReveal » : défaut contacts (indigo),
 * variantes adhésion/boutique (ambre / jaune / citron) et don (bleu moderne).
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

/** Don — dégradé bleu moderne (aligné sur le hero contacts). */
export const MAGIC_HERO_DONATION_TYPOGRAPHY_CLASSES =
  "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent" as const;

/** Canvas MagicTextReveal : indigo-600 (cœur du dégradé don). */
export const MAGIC_HERO_DONATION_COLOR = "rgb(79 70 229)" as const;

/** Contacts — noir moderne (zinc / ardoise). */
export const MAGIC_HERO_CONTACT_TYPOGRAPHY_CLASSES =
  "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-600 via-slate-800 to-zinc-950 bg-clip-text text-transparent" as const;

export const MAGIC_HERO_CONTACT_COLOR = "rgb(39 39 42)" as const;
