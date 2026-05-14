/**
 * Configuration centralisée pour la page contacts
 * Tous les styles, animations et messages sont définis ici pour faciliter la maintenance
 */

import { MAGIC_HERO_PAGE_TITLE_TYPOGRAPHY_CLASSES } from "@/config/magic-hero-page-title";

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
  },
  contactInfo: {
    container: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2, duration: 0.4 },
    },
    social: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3, duration: 0.4 },
    },
    card: {
      whileHover: {
        y: -6,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      },
    },
    socialButton: {
      whileHover: {
        scale: 1.08,
        y: -5,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      },
      whileTap: { scale: 0.95 },
    },
  },
  form: {
    container: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4, duration: 0.5 },
    },
    header: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.45 },
    },
    field: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.05 },
    },
    error: {
      initial: { opacity: 0, y: -5 },
      animate: { opacity: 1, y: 0 },
    },
    submit: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.7 },
    },
    button: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    },
  },
  success: {
    icon: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    title: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.15, duration: 0.4 },
    },
    message: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.25, duration: 0.4 },
    },
  },
} as const;

// Configuration des styles (classes CSS)
export const STYLE_CONFIG = {
  container:
    "mx-auto flex w-full min-w-0 max-w-5xl flex-col items-center gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-10 lg:px-8",
  hero: {
    wrapper: "mx-auto w-full min-w-0 max-w-4xl text-center mb-8 sm:mb-12",
    title: MAGIC_HERO_PAGE_TITLE_TYPOGRAPHY_CLASSES,
    description:
      "mt-2 sm:mt-3 max-w-3xl text-pretty text-base leading-relaxed text-gray-700 sm:text-lg mx-auto",
  },
  contactInfo: {
    grid:
      "mx-auto grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 mb-8 sm:mb-12",
    card:
      "group relative flex h-full w-full flex-col rounded-3xl bg-white p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9),0_0_0_1px_rgb(148_163_184/0.07),0_1px_2px_-1px_rgb(15_23_42/0.04),0_8px_24px_-6px_rgb(59_130_246/0.08),0_24px_56px_-14px_rgb(15_23_42/0.07),0_48px_96px_-28px_rgb(99_102_241/0.06)] transition-[box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.95),0_0_0_1px_rgb(148_163_184/0.1),0_2px_6px_-2px_rgb(15_23_42/0.05),0_14px_36px_-8px_rgb(59_130_246/0.14),0_36px_72px_-16px_rgb(15_23_42/0.1),0_64px_120px_-32px_rgb(79_70_229/0.09)] sm:p-6",
    icon:
      "mb-3 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-[inset_0_1px_0_0_rgb(255_255_255/0.65),0_1px_2px_rgb(15_23_42/0.04),0_6px_16px_-4px_rgb(59_130_246/0.12),0_14px_32px_-8px_rgb(15_23_42/0.08)] transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14",
    socialGrid: "flex flex-wrap items-center justify-center gap-3 sm:gap-4",
    socialButton:
      "group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white transition-[box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.28),0_0_0_1px_rgb(255_255_255/0.1),0_2px_4px_-1px_rgb(15_23_42/0.14),0_8px_18px_-4px_rgb(59_130_246/0.22),0_16px_36px_-10px_rgb(15_23_42/0.14),0_28px_56px_-14px_rgb(99_102_241/0.12)] hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.38),0_0_0_1px_rgb(255_255_255/0.14),0_4px_8px_-2px_rgb(15_23_42/0.12),0_12px_28px_-6px_rgb(59_130_246/0.32),0_24px_48px_-12px_rgb(15_23_42/0.18),0_40px_72px_-18px_rgb(79_70_229/0.16)] sm:h-14 sm:w-14",
  },
  form: {
    wrapper:
      "mx-auto w-full min-w-0 max-w-3xl rounded-3xl bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 p-[2px] transition-[box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),0_0_0_1px_rgb(99_102_241/0.12),0_2px_4px_-2px_rgb(15_23_42/0.05),0_12px_32px_-8px_rgb(59_130_246/0.12),0_32px_72px_-16px_rgb(15_23_42/0.08),0_56px_112px_-28px_rgb(99_102_241/0.1)] hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.45),0_0_0_1px_rgb(99_102_241/0.16),0_4px_8px_-4px_rgb(15_23_42/0.06),0_18px_48px_-10px_rgb(59_130_246/0.18),0_44px_88px_-18px_rgb(15_23_42/0.11),0_72px_140px_-32px_rgb(79_70_229/0.12)]",
    container:
      "rounded-3xl bg-white p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9)] sm:p-8 space-y-5 sm:space-y-7",
    header:
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-200/60",
    badge:
      "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200/50",
    fieldGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    label: "text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2",
    input:
      "w-full rounded-xl border-2 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 transition-all duration-200 bg-white",
    inputError:
      "border-red-400 focus:ring-red-300 focus:border-red-500 bg-red-50/50",
    inputValid:
      "border-gray-300 focus:ring-blue-300 focus:border-blue-400 hover:border-blue-300",
    textarea: "resize-none",
    error: "text-xs text-red-600 mt-1 flex items-center gap-1.5",
    submitButton:
      "w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 ring-1 ring-white/10 cursor-pointer transition-all duration-300",
    submitButtonDisabled: "opacity-50 cursor-not-allowed",
  },
  success: {
    container: "max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center",
    icon: "inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100",
    title:
      "mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent",
    message:
      "mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto",
  },
} as const;

// Messages et textes
export const MESSAGES = {
  hero: {
    title: "Contactez-nous",
    description:
      "Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à nous contacter par email, téléphone ou via nos réseaux sociaux.",
  },
  form: {
    title: "Formulaire de contact",
    badge: "Envoyez-nous un message",
    submit: "Envoyer le message",
    submitting: "Envoi en cours...",
  },
  success: {
    title: "Message envoyé avec succès !",
    message:
      "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.",
  },
  social: {
    title: "Suivez-nous sur les réseaux sociaux",
  },
  formValidation: {
    firstName: {
      required: "Le prénom est requis",
      min: "Le prénom doit contenir au moins 2 caractères",
    },
    lastName: {
      required: "Le nom est requis",
      min: "Le nom doit contenir au moins 2 caractères",
    },
    email: {
      required: "L'adresse email est requise",
      invalid: "Veuillez entrer une adresse email valide (ex: nom@exemple.com)",
    },
    phone: {
      invalid: "Le format du numéro est invalide. Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78",
    },
    subject: {
      required: "Le sujet est requis",
      min: "Le sujet doit contenir au moins 5 caractères",
    },
    message: {
      required: "Le message est requis",
      min: "Le message doit contenir au moins 10 caractères",
    },
  },
} as const;

