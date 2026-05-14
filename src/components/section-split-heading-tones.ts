/**
 * Palettes des titres « split » : tons contemporains, lisibles, peu saturés sur fond clair ;
 * variantes plus lumineuses en `dark:`.
 */
export const SECTION_SPLIT_TONE = {
  hero: "hero",
  poles: "poles",
  events: "events",
  stats: "stats",
  reviews: "reviews",
  partners: "partners",
  video: "video",
  shop: "shop",
} as const;

export type SectionSplitTone = keyof typeof SECTION_SPLIT_TONE;

export interface SectionSplitToneStyles {
  splitTop: string;
  splitBottom: string;
  ambientPrimary: string;
  ambientHighlight: string;
  separatorVeil: string;
  separatorBar: string;
  separatorShadow: string;
  separatorShadowDark: string;
  headingGlow: string;
  headingGlowDark: string;
}

export const SECTION_SPLIT_TONE_STYLES: Record<
  SectionSplitTone,
  SectionSplitToneStyles
> = {
  hero: {
    splitTop:
      "bg-gradient-to-br from-slate-700 via-blue-600 to-cyan-400 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 bg-clip-text font-extrabold text-transparent dark:from-slate-100 dark:via-sky-400 dark:to-cyan-300",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-blue-500/12 via-cyan-300/14 to-sky-400/12 blur-3xl dark:from-blue-400/10 dark:via-cyan-500/10 dark:to-sky-500/8",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-2xl dark:bg-white/10",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/0 via-cyan-500/8 to-blue-500/0 dark:via-cyan-400/16",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_10%,#ffffff_48%,#ffffff_52%,rgba(255,255,255,0.18)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_1px_rgba(255,255,255,0.65),0_0_22px_rgb(34_211_238_/_0.14),0_10px_32px_-8px_rgb(59_130_246_/_0.1)]",
    separatorShadowDark:
      "dark:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_12%,rgba(255,255,255,0.82)_48%,rgba(255,255,255,0.82)_52%,rgba(255,255,255,0.06)_88%,transparent_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_18px_rgb(34_211_238_/_0.1),0_8px_28px_-6px_rgb(59_130_246_/_0.14)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.55)] drop-shadow-[0_10px_24px_rgb(59_130_246_/_0.1)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_22px_rgb(34_211_238_/_0.12)]",
  },
  poles: {
    splitTop:
      "bg-gradient-to-br from-indigo-600 via-violet-500 to-fuchsia-400 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-slate-900 via-indigo-800 to-violet-700 bg-clip-text font-extrabold text-transparent dark:from-slate-100 dark:via-violet-300 dark:to-fuchsia-300",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-indigo-500/12 via-violet-400/14 to-fuchsia-400/12 blur-3xl dark:from-indigo-400/8 dark:via-violet-500/8 dark:to-fuchsia-500/6",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100/40 blur-2xl dark:bg-violet-950/25",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-500/0 via-violet-400/10 to-violet-500/0 dark:via-fuchsia-400/14",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_10%,#ffffff_48%,#ffffff_52%,rgba(255,255,255,0.18)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_1px_rgba(255,255,255,0.65),0_0_20px_rgb(167_139_250_/_0.18),0_10px_32px_-8px_rgb(139_92_246_/_0.08)]",
    separatorShadowDark:
      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_0_18px_rgb(167_139_250_/_0.1),0_8px_28px_-6px_rgb(192_132_252_/_0.12)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.55)] drop-shadow-[0_10px_22px_rgb(139_92_246_/_0.1)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_22px_rgb(192_132_252_/_0.12)]",
  },
  events: {
    splitTop:
      "bg-gradient-to-br from-amber-600 via-amber-400 to-lime-400 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-orange-900 via-amber-700 to-emerald-700 bg-clip-text font-extrabold text-transparent dark:from-amber-200 dark:via-yellow-300 dark:to-lime-300",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-amber-400/14 via-yellow-300/14 to-lime-300/12 blur-3xl dark:from-amber-500/8 dark:via-yellow-400/8 dark:to-lime-500/6",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/55 blur-2xl dark:bg-amber-950/20",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 dark:via-yellow-400/12",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_10%,#fffef5_48%,#fffef5_52%,rgba(255,255,255,0.2)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_0_1px_rgba(255,252,240,0.75),0_0_20px_rgb(251_191_36_/_0.18),0_10px_32px_-8px_rgb(234_179_8_/_0.08)]",
    separatorShadowDark:
      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_0_18px_rgb(251_191_36_/_0.1),0_8px_28px_-6px_rgb(250_204_21_/_0.1)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)] drop-shadow-[0_10px_22px_rgb(251_191_36_/_0.12)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_20px_rgb(250_204_21_/_0.1)]",
  },
  stats: {
    splitTop:
      "bg-gradient-to-br from-rose-500 via-amber-400 to-emerald-500 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-rose-700 via-amber-600 to-emerald-700 bg-clip-text font-extrabold text-transparent dark:from-rose-300 dark:via-amber-200 dark:to-emerald-300",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-rose-400/10 via-amber-300/10 to-emerald-400/10 blur-3xl dark:from-rose-500/6 dark:via-amber-400/6 dark:to-emerald-500/6",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-2xl dark:bg-white/6",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-400/0 via-amber-400/8 to-emerald-400/0 dark:via-amber-400/12",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_10%,#ffffff_48%,#ffffff_52%,rgba(255,255,255,0.18)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_1px_rgba(255,255,255,0.65),0_0_22px_rgb(251_191_36_/_0.14),0_10px_32px_-8px_rgb(16_185_129_/_0.08)]",
    separatorShadowDark:
      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_0_18px_rgb(244_63_94_/_0.08),0_8px_28px_-6px_rgb(52_211_153_/_0.1)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.55)] drop-shadow-[0_10px_24px_rgb(251_191_36_/_0.1)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_22px_rgb(52_211_153_/_0.1)]",
  },
  reviews: {
    splitTop:
      "bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-stone-900 via-orange-800 to-amber-700 bg-clip-text font-extrabold text-transparent dark:from-orange-100 dark:via-amber-200 dark:to-yellow-100",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-amber-400/14 via-yellow-300/12 to-orange-300/12 blur-3xl dark:from-amber-500/8 dark:via-yellow-400/6 dark:to-orange-400/6",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/60 blur-2xl dark:bg-amber-950/18",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 dark:via-yellow-300/12",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_10%,#fffbeb_48%,#fffbeb_52%,rgba(255,255,255,0.2)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_0_1px_rgba(255,251,235,0.75),0_0_20px_rgb(245_158_11_/_0.16),0_10px_32px_-8px_rgb(251_191_36_/_0.08)]",
    separatorShadowDark:
      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_18px_rgb(245_158_11_/_0.08),0_8px_28px_-6px_rgb(251_191_36_/_0.1)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.58)] drop-shadow-[0_10px_22px_rgb(251_191_36_/_0.1)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_20px_rgb(253_230_138_/_0.1)]",
  },
  partners: {
    splitTop:
      "bg-gradient-to-br from-slate-700 via-blue-600 to-cyan-400 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-slate-950 via-blue-800 to-cyan-700 bg-clip-text font-extrabold text-transparent dark:from-slate-100 dark:via-sky-400 dark:to-cyan-300",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-blue-500/12 via-sky-300/14 to-cyan-400/12 blur-3xl dark:from-blue-400/8 dark:via-sky-500/8 dark:to-cyan-500/6",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-50/50 blur-2xl dark:bg-slate-900/28",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-500/0 via-cyan-400/10 to-sky-500/0 dark:via-sky-500/14",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_10%,#ffffff_48%,#ffffff_52%,rgba(255,255,255,0.18)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_1px_rgba(255,255,255,0.65),0_0_20px_rgb(56_189_248_/_0.14),0_10px_32px_-8px_rgb(59_130_246_/_0.08)]",
    separatorShadowDark:
      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_0_18px_rgb(56_189_248_/_0.1),0_8px_28px_-6px_rgb(59_130_246_/_0.12)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.55)] drop-shadow-[0_10px_24px_rgb(59_130_246_/_0.09)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_22px_rgb(56_189_248_/_0.12)]",
  },
  video: {
    splitTop:
      "bg-gradient-to-br from-slate-700 via-orange-500 to-rose-500 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-slate-900 via-orange-800 to-rose-700 bg-clip-text font-extrabold text-transparent dark:from-stone-100 dark:via-orange-300 dark:to-rose-300",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-orange-400/12 via-rose-300/12 to-amber-200/10 blur-3xl dark:from-orange-500/6 dark:via-rose-500/6 dark:to-amber-500/5",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-50/50 blur-2xl dark:bg-rose-950/20",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-400/0 via-rose-400/10 to-orange-400/0 dark:via-rose-400/12",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_10%,#fff7ed_48%,#fff7ed_52%,rgba(255,255,255,0.2)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_0_1px_rgba(255,247,237,0.72),0_0_20px_rgb(251_146_60_/_0.14),0_10px_32px_-8px_rgb(244_63_94_/_0.06)]",
    separatorShadowDark:
      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_0_18px_rgb(251_146_60_/_0.08),0_8px_28px_-6px_rgb(251_113_133_/_0.08)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.55)] drop-shadow-[0_10px_22px_rgb(251_146_60_/_0.08)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_20px_rgb(251_113_133_/_0.1)]",
  },
  shop: {
    splitTop:
      "bg-gradient-to-br from-rose-500 via-amber-400 to-emerald-500 bg-clip-text font-extrabold text-transparent",
    splitBottom:
      "bg-gradient-to-br from-rose-700 via-amber-600 to-emerald-700 bg-clip-text font-extrabold text-transparent dark:from-rose-300 dark:via-amber-200 dark:to-emerald-300",
    ambientPrimary:
      "pointer-events-none absolute left-1/2 top-[40%] h-44 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-gradient-to-r from-rose-400/10 via-amber-300/10 to-emerald-400/10 blur-3xl dark:from-rose-500/6 dark:via-amber-400/6 dark:to-emerald-500/6",
    ambientHighlight:
      "pointer-events-none absolute left-1/2 top-[48%] h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-2xl dark:bg-white/6",
    separatorVeil:
      "pointer-events-none absolute -inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-400/0 via-amber-400/8 to-emerald-400/0 dark:via-amber-400/12",
    separatorBar:
      "relative mx-auto h-[2px] max-w-xs origin-center rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_10%,#ffffff_48%,#ffffff_52%,rgba(255,255,255,0.18)_90%,transparent_100%)] sm:max-w-sm",
    separatorShadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_1px_rgba(255,255,255,0.65),0_0_20px_rgb(251_191_36_/_0.12),0_10px_32px_-8px_rgb(16_185_129_/_0.07)]",
    separatorShadowDark:
      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_0_18px_rgb(244_63_94_/_0.06),0_8px_28px_-6px_rgb(52_211_153_/_0.08)]",
    headingGlow:
      "drop-shadow-[0_1px_2px_rgba(255,255,255,0.55)] drop-shadow-[0_10px_22px_rgb(251_191_36_/_0.09)]",
    headingGlowDark:
      "dark:drop-shadow-[0_8px_20px_rgb(52_211_153_/_0.1)]",
  },
};
