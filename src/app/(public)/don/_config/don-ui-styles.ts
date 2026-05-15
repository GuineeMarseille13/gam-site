/**
 * Surfaces « flottantes » (ombres multicouches) alignées sur la page Contacts,
 * avec teinte bleue sur le cadre gradient don.
 */

const CONTACT_FLOATING_CARD_SHADOW =
  "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9),0_0_0_1px_rgb(148_163_184/0.07),0_1px_2px_-1px_rgb(15_23_42/0.04),0_8px_24px_-6px_rgb(59_130_246/0.08),0_24px_56px_-14px_rgb(15_23_42/0.07),0_48px_96px_-28px_rgb(99_102_241/0.06)]"

const CONTACT_FLOATING_CARD_SHADOW_HOVER =
  "hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.95),0_0_0_1px_rgb(148_163_184/0.1),0_2px_6px_-2px_rgb(15_23_42/0.05),0_14px_36px_-8px_rgb(59_130_246/0.14),0_36px_72px_-16px_rgb(15_23_42/0.1),0_64px_120px_-32px_rgb(79_70_229/0.09)]"

const BLUE_GRADIENT_WRAPPER_SHADOW =
  "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),0_0_0_1px_rgb(59_130_246/0.22),0_2px_4px_-2px_rgb(15_23_42/0.05),0_12px_32px_-8px_rgb(59_130_246/0.16),0_32px_72px_-16px_rgb(15_23_42/0.08),0_56px_112px_-28px_rgb(99_102_241/0.12)]"

const BLUE_GRADIENT_WRAPPER_SHADOW_HOVER =
  "hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.45),0_0_0_1px_rgb(37_99_235/0.26),0_4px_8px_-4px_rgb(15_23_42/0.06),0_18px_48px_-10px_rgb(59_130_246/0.2),0_44px_88px_-18px_rgb(15_23_42/0.1),0_72px_140px_-32px_rgb(79_70_229/0.14)]"

const GRADIENT_WRAPPER_TRANSITION =
  "transition-[box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"

const DON_GRADIENT_FRAME =
  "bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 p-[2px]"

/** Cartes bénéfices (Financement des projets, etc.). */
export const DON_BENEFIT_CARD_CLASSNAME = [
  "group relative flex h-full w-full items-start gap-4 rounded-3xl bg-white p-4 sm:p-6",
  CONTACT_FLOATING_CARD_SHADOW,
  CONTACT_FLOATING_CARD_SHADOW_HOVER,
  GRADIENT_WRAPPER_TRANSITION,
].join(" ")

/** Icône dans les cartes bénéfices. */
export const DON_BENEFIT_ICON_CLASSNAME =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 text-blue-700 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.65),0_1px_2px_rgb(15_23_42/0.04),0_6px_16px_-4px_rgb(59_130_246/0.18),0_14px_32px_-8px_rgb(15_23_42/0.08)] transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"

/** Cadre gradient du formulaire de don. */
export const DON_FORM_GRADIENT_WRAPPER_CLASSNAME = [
  "rounded-3xl",
  DON_GRADIENT_FRAME,
  GRADIENT_WRAPPER_TRANSITION,
  BLUE_GRADIENT_WRAPPER_SHADOW,
  BLUE_GRADIENT_WRAPPER_SHADOW_HOVER,
].join(" ")

/** Cadre gradient du panneau paiement Stripe. */
export const DON_PAYMENT_PANEL_GRADIENT_WRAPPER_CLASSNAME = [
  "rounded-2xl sm:rounded-3xl",
  DON_GRADIENT_FRAME,
  GRADIENT_WRAPPER_TRANSITION,
  BLUE_GRADIENT_WRAPPER_SHADOW,
  BLUE_GRADIENT_WRAPPER_SHADOW_HOVER,
].join(" ")

/** Surface blanche intérieure du formulaire. */
export const DON_FORM_INNER_SURFACE_CLASSNAME =
  "rounded-3xl bg-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9)]"

/** Surface blanche du panneau paiement. */
export const DON_PAYMENT_INNER_SURFACE_CLASSNAME =
  "rounded-2xl sm:rounded-3xl bg-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9)]"

/** Champs formulaire — focus bleu cohérent. */
export const DON_FIELD_INPUT_CLASSNAME =
  "w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 hover:border-blue-300 transition-all duration-200 bg-white"

/** Montant suggéré sélectionné. */
export const DON_AMOUNT_SELECTED_CLASSNAME =
  "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-600 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25),0_4px_14px_-2px_rgb(37_99_235/0.45),0_12px_28px_-8px_rgb(15_23_42/0.15)] scale-105"

/** Montant suggéré non sélectionné. */
export const DON_AMOUNT_DEFAULT_CLASSNAME =
  "border-gray-300 bg-white text-gray-700 shadow-[inset_0_1px_0_0_rgb(255_255_255/1),0_1px_2px_rgb(15_23_42/0.05),0_6px_16px_-6px_rgb(59_130_246/0.1)] hover:border-blue-400 hover:bg-blue-50 hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/1),0_2px_6px_-2px_rgb(15_23_42/0.06),0_10px_24px_-8px_rgb(59_130_246/0.16)]"

/** Badge montant sélectionné dans l’en-tête du formulaire. */
export const DON_AMOUNT_BADGE_CLASSNAME =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50"

/** Champ montant personnalisé. */
export const DON_CUSTOM_AMOUNT_INPUT_CLASSNAME =
  "flex-1 max-w-[220px] rounded-xl border-2 border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 hover:border-blue-300 transition-colors"

/** Bouton principal « Faire un don ». */
export const DON_SUBMIT_BUTTON_CLASSNAME =
  "w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 ring-1 ring-white/10 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
