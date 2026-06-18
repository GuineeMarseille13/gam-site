/** Layout du `<h1>` hero — centrage et gouttières communes aux pages publiques. */
export const PAGE_HERO_TITLE_H1_LAYOUT =
  "flex w-full min-w-0 justify-center px-1 sm:px-2" as const

/** Animation d’entrée du `<h1>` (Framer Motion). */
export const PAGE_HERO_TITLE_MOTION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
} as const
