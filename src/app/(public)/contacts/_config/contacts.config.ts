/**
 * Configuration centralisée pour la page contacts
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
      whileHover: { y: -4, transition: { duration: 0.2 } },
    },
    socialButton: {
      whileHover: { scale: 1.1, y: -2 },
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
  container: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10",
  hero: {
    wrapper: "text-center mb-8 sm:mb-12",
    title:
      "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent mb-3 sm:mb-4",
    description:
      "mt-2 sm:mt-3 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4",
    divider:
      "mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full",
  },
  contactInfo: {
    grid: "grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12",
    card:
      "group rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300",
    icon: "inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md mb-3",
    socialGrid: "flex flex-wrap items-center justify-center gap-3 sm:gap-4",
    socialButton:
      "group relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br text-white shadow-lg hover:shadow-xl transition-all duration-300",
  },
  form: {
    wrapper:
      "rounded-3xl p-[2px] bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 shadow-xl shadow-blue-100/50",
    container:
      "rounded-3xl border border-gray-200/50 bg-white/90 backdrop-blur-sm p-5 sm:p-8 shadow-inner space-y-5 sm:space-y-7",
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

