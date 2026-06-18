/**
 * Palettes du slider titre hero — alignées sur les anciennes couleurs MagicTextReveal par page.
 */
export const PAGE_HERO_SLIDER_VARIANT = {
  association: "association",
  contact: "contact",
  membership: "membership",
  shop: "shop",
  donation: "donation",
} as const

export type PageHeroSliderVariant =
  (typeof PAGE_HERO_SLIDER_VARIANT)[keyof typeof PAGE_HERO_SLIDER_VARIANT]

interface PageHeroSliderTheme {
  readonly border: string
  readonly handleBorder: string
  readonly handleRing: string
  readonly handleBar: string
  readonly text: string
}

export const PAGE_HERO_SLIDER_THEMES: Record<
  PageHeroSliderVariant,
  PageHeroSliderTheme
> = {
  association: {
    border: "border-theme-green/80",
    handleBorder: "border-theme-green",
    handleRing: "focus:ring-theme-green/60",
    handleBar: "bg-theme-green",
    text: "bg-gradient-to-r from-theme-green via-emerald-500 to-theme-green-dark bg-clip-text text-transparent dark:from-theme-green-light dark:via-emerald-300 dark:to-theme-green",
  },
  contact: {
    border: "border-zinc-600/80 dark:border-zinc-400/70",
    handleBorder: "border-zinc-700 dark:border-zinc-400",
    handleRing: "focus:ring-zinc-500/60",
    handleBar: "bg-zinc-800 dark:bg-zinc-300",
    text: "bg-gradient-to-r from-zinc-600 via-slate-800 to-zinc-950 bg-clip-text text-transparent dark:from-zinc-300 dark:via-neutral-200 dark:to-zinc-400",
  },
  membership: {
    border: "border-amber-500/80",
    handleBorder: "border-amber-500",
    handleRing: "focus:ring-amber-400/60",
    handleBar: "bg-amber-500",
    text: "bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent",
  },
  shop: {
    border: "border-amber-500/80",
    handleBorder: "border-amber-500",
    handleRing: "focus:ring-amber-400/60",
    handleBar: "bg-amber-500",
    text: "bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent",
  },
  donation: {
    border: "border-indigo-500/80",
    handleBorder: "border-indigo-500",
    handleRing: "focus:ring-indigo-400/60",
    handleBar: "bg-indigo-500",
    text: "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent",
  },
}

export function getPageHeroSliderTheme(
  variant: PageHeroSliderVariant = PAGE_HERO_SLIDER_VARIANT.association,
): PageHeroSliderTheme {
  return PAGE_HERO_SLIDER_THEMES[variant]
}
