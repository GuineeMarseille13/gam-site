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
  container: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10",
  hero: {
    wrapper: "text-center mb-10 sm:mb-14",
    title:
      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-3 sm:mb-4",
    description:
      "mt-2 sm:mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto px-4",
    divider:
      "mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-amber-400 to-amber-500 rounded-full",
  },
  stats: {
    grid: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-12",
    card:
      "group rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 text-center",
    value:
      "text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-600 via-yellow-600 to-lime-600 bg-clip-text text-transparent mb-2",
    label: "text-sm sm:text-base text-gray-600 font-medium",
  },
  yearSection: {
    wrapper:
      "rounded-2xl sm:rounded-3xl border border-slate-200/50 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
    inner: "overflow-hidden",
    button:
      "w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors duration-300 group relative overflow-hidden",
    shine:
      "absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out",
    indicator:
      "w-1 h-12 sm:h-16 rounded-full bg-gradient-to-b from-amber-400 to-amber-600",
    year:
      "text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight",
    count: "text-sm text-slate-500 mt-0.5",
    chevron:
      "w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-amber-500 transition-colors duration-300",
    content: "px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-6 sm:pb-8 space-y-6 sm:space-y-8 bg-slate-50/30",
  },
  eventCard: {
    wrapper:
      "group relative rounded-2xl sm:rounded-3xl border border-slate-200/60 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-amber-200/50 transition-all duration-300 ease-out overflow-hidden",
    badge:
      "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-amber-900 bg-amber-100/90 rounded-full border border-amber-200/50",
    location: "text-xs sm:text-sm text-slate-500 flex items-center gap-1.5",
    title:
      "text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight",
    description: "text-sm sm:text-base text-slate-600 leading-relaxed mb-4 sm:mb-6",
  },
  mediaGallery: {
    container: "space-y-3 sm:space-y-4 mt-1",
    mediaWrapper:
      "relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 group shadow-lg",
    overlay:
      "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-3 sm:p-4",
    navButton:
      "absolute top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl flex items-center justify-center hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 border border-gray-200",
    navButtonLeft: "left-3 sm:left-5",
    navButtonRight: "right-3 sm:right-5",
    indicator:
      "absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20",
    thumbnails: "flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide",
    thumbnail:
      "flex-shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer",
    thumbnailActive:
      "border-amber-500 shadow-lg shadow-amber-500/30 scale-105",
    thumbnailInactive:
      "border-gray-200 hover:border-amber-300 opacity-70 hover:opacity-100",
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

