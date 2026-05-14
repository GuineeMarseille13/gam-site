/**
 * Surfaces « flottantes » (ombres multicouches) alignées sur la page Contacts,
 * avec teinte rose sur le cadre gradient don.
 */

const CONTACT_FLOATING_CARD_SHADOW =
  "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9),0_0_0_1px_rgb(148_163_184/0.07),0_1px_2px_-1px_rgb(15_23_42/0.04),0_8px_24px_-6px_rgb(59_130_246/0.08),0_24px_56px_-14px_rgb(15_23_42/0.07),0_48px_96px_-28px_rgb(99_102_241/0.06)]"

const CONTACT_FLOATING_CARD_SHADOW_HOVER =
  "hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.95),0_0_0_1px_rgb(148_163_184/0.1),0_2px_6px_-2px_rgb(15_23_42/0.05),0_14px_36px_-8px_rgb(59_130_246/0.14),0_36px_72px_-16px_rgb(15_23_42/0.1),0_64px_120px_-32px_rgb(79_70_229/0.09)]"

const PINK_GRADIENT_WRAPPER_SHADOW =
  "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),0_0_0_1px_rgb(244_114_182/0.22),0_2px_4px_-2px_rgb(15_23_42/0.05),0_12px_32px_-8px_rgb(244_114_182/0.16),0_32px_72px_-16px_rgb(15_23_42/0.08),0_56px_112px_-28px_rgb(251_113_133/0.12)]"

const PINK_GRADIENT_WRAPPER_SHADOW_HOVER =
  "hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.45),0_0_0_1px_rgb(219_39_119/0.26),0_4px_8px_-4px_rgb(15_23_42/0.06),0_18px_48px_-10px_rgb(236_72_153/0.2),0_44px_88px_-18px_rgb(15_23_42/0.1),0_72px_140px_-32px_rgb(244_63_94/0.14)]"

const GRADIENT_WRAPPER_TRANSITION =
  "transition-[box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"

const DON_GRADIENT_FRAME =
  "bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 p-[2px]"

/** Cartes bénéfices (Financement des projets, etc.). */
export const DON_BENEFIT_CARD_CLASSNAME = [
  "group relative flex h-full w-full items-start gap-4 rounded-3xl bg-white p-4 sm:p-6",
  CONTACT_FLOATING_CARD_SHADOW,
  CONTACT_FLOATING_CARD_SHADOW_HOVER,
  GRADIENT_WRAPPER_TRANSITION,
].join(" ")

/** Icône dans les cartes bénéfices. */
export const DON_BENEFIT_ICON_CLASSNAME =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.65),0_1px_2px_rgb(15_23_42/0.04),0_6px_16px_-4px_rgb(244_114_182/0.18),0_14px_32px_-8px_rgb(15_23_42/0.08)] transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"

/** Cadre gradient du formulaire de don. */
export const DON_FORM_GRADIENT_WRAPPER_CLASSNAME = [
  "rounded-3xl",
  DON_GRADIENT_FRAME,
  GRADIENT_WRAPPER_TRANSITION,
  PINK_GRADIENT_WRAPPER_SHADOW,
  PINK_GRADIENT_WRAPPER_SHADOW_HOVER,
].join(" ")

/** Cadre gradient du panneau paiement Stripe. */
export const DON_PAYMENT_PANEL_GRADIENT_WRAPPER_CLASSNAME = [
  "rounded-2xl sm:rounded-3xl",
  DON_GRADIENT_FRAME,
  GRADIENT_WRAPPER_TRANSITION,
  PINK_GRADIENT_WRAPPER_SHADOW,
  PINK_GRADIENT_WRAPPER_SHADOW_HOVER,
].join(" ")

/** Surface blanche intérieure du formulaire. */
export const DON_FORM_INNER_SURFACE_CLASSNAME =
  "rounded-3xl bg-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9)]"

/** Surface blanche du panneau paiement. */
export const DON_PAYMENT_INNER_SURFACE_CLASSNAME =
  "rounded-2xl sm:rounded-3xl bg-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9)]"
