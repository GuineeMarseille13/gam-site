/**
 * Configuration centralisée pour la page événements
 * Tous les styles, animations et messages sont définis ici pour faciliter la maintenance
 */

// Configuration des animations
export const ANIMATION_CONFIG = {
  hero: {
    title: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    },
    description: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.1, duration: 0.4 },
    },
    divider: {
      initial: { scaleX: 0 },
      animate: { scaleX: 1 },
      transition: { delay: 0.3, duration: 0.5 },
    },
  },
  stats: {
    container: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2, duration: 0.4 },
    },
    card: {
      whileHover: { y: -4, transition: { duration: 0.2 } },
    },
  },
  yearSection: {
    wrapper: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      delayMultiplier: 0.08,
    },
    chevron: {
      duration: 0.3,
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
    expand: {
      initial: { height: 0, opacity: 0 },
      animate: { height: "auto", opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    content: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 },
      transition: { duration: 0.4, delay: 0.1 },
    },
  },
  eventCard: {
    wrapper: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      delayMultiplier: 0.06,
    },
    hover: {
      y: -2,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
  },
  mediaGallery: {
    slide: {
      spring: { stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
    overlay: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3 },
    },
    indicator: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3 },
    },
    thumbnail: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    },
  },
} as const;

// Configuration des styles (classes CSS)
export const STYLE_CONFIG = {
  container:
    "mx-auto w-full max-w-7xl px-0 py-6 sm:px-6 sm:py-10 lg:px-8",
  hero: {
    wrapper: "mb-8 text-center sm:mb-14",
    title:
      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-3 sm:mb-4",
    description:
      "mt-2 sm:mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto px-4",
    divider:
      "mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-amber-400 to-amber-500 rounded-full",
  },
  stats: {
    grid: "mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-2 sm:gap-5",
    card:
      "group w-full rounded-xl border border-gray-200/80 bg-white/90 p-4 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/50 sm:rounded-2xl sm:p-5",
    value:
      "text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-600 via-yellow-600 to-lime-600 bg-clip-text text-transparent mb-2",
    label: "text-sm sm:text-base text-gray-600 font-medium",
  },
  yearSection: {
    wrapper:
      "w-full overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:rounded-2xl md:rounded-3xl",
    inner: "overflow-hidden",
    button:
      "group relative flex w-full items-center justify-between overflow-hidden px-3 py-4 transition-colors duration-300 hover:bg-slate-50/80 sm:px-6 sm:py-5 md:px-8 md:py-6",
    shine:
      "absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out",
    indicator:
      "w-1 h-12 sm:h-16 rounded-full bg-gradient-to-b from-amber-400 to-amber-600",
    year:
      "text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight",
    count: "text-sm text-slate-500 mt-0.5",
    chevron:
      "w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-amber-500 transition-colors duration-300",
    content:
      "space-y-4 bg-slate-50/30 px-3 pt-4 pb-5 sm:space-y-6 sm:px-6 sm:pt-6 sm:pb-8 md:space-y-8 md:px-8",
  },
  eventCard: {
    wrapper:
      "group relative w-full min-w-0 overflow-hidden rounded-xl border border-slate-200/60 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:border-amber-200/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:rounded-2xl sm:p-6 md:rounded-3xl",
    badge:
      "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-amber-900 bg-amber-100/90 rounded-full border border-amber-200/50",
    location: "text-xs sm:text-sm text-slate-500 flex items-center gap-1.5",
    title:
      "text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight",
    description: "text-sm sm:text-base text-slate-600 leading-relaxed mb-4 sm:mb-6",
  },
  mediaGallery: {
    container: "mt-2 w-full min-w-0 space-y-3 sm:mt-1 sm:space-y-4",
    mediaWrapper:
      "relative aspect-[4/3] touch-pan-y overflow-hidden rounded-xl bg-muted shadow-md ring-1 ring-border/40 sm:aspect-video sm:rounded-2xl",
    overlay:
      "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4 sm:pt-12",
    overlayText:
      "line-clamp-2 text-pretty text-left text-xs font-medium leading-snug text-white drop-shadow-md sm:text-sm",
    expandHint:
      "pointer-events-none absolute top-3 left-3 z-[6] inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md sm:hidden",
    navButton:
      "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-lg backdrop-blur-sm transition-opacity duration-200 sm:size-11 sm:opacity-0 sm:group-hover/stage:opacity-100",
    navButtonLeft: "left-2 sm:left-4",
    navButtonRight: "right-2 sm:right-4",
    indicator:
      "absolute top-3 right-3 z-10 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 backdrop-blur-md sm:top-auto sm:right-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:px-3 sm:py-1.5",
    thumbnailsWrapper: "space-y-2",
    thumbnailsLabel:
      "text-xs font-medium text-muted-foreground sm:text-sm",
    thumbnails:
      "flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    thumbnail:
      "relative shrink-0 snap-center size-[4.5rem] cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 sm:size-20 sm:rounded-xl",
    thumbnailActive: "border-amber-500 opacity-100 shadow-md shadow-amber-500/25",
    thumbnailInactive:
      "border-border/70 opacity-80 hover:border-amber-300 hover:opacity-100",
  },
  emptyState: {
    wrapper: "text-center py-16 md:py-24",
    message: "text-lg text-gray-500",
  },
} as const;

// Messages et textes
export const MESSAGES = {
  hero: {
    title: "Nos Événements",
    description:
      "Découvrez tous les événements organisés par l'association GAM au fil des années. Chaque événement est une occasion de rassembler notre communauté et de créer des moments inoubliables.",
  },
  stats: {
    eventsLabel: (count: number) =>
      `Événement${count > 1 ? "s" : ""} organisé${count > 1 ? "s" : ""}`,
    yearsLabel: (count: number) => `Année${count > 1 ? "s" : ""} d'activité`,
  },
  yearSection: {
    eventCount: (count: number) =>
      `${count} événement${count > 1 ? "s" : ""}`,
  },
  emptyState: "Aucun événement à afficher pour le moment.",
  media: {
    previous: "Média précédent",
    next: "Média suivant",
    view: (index: number) => `Voir média ${index + 1}`,
  },
} as const;

// Configuration des transitions
export const TRANSITION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
} as const;

