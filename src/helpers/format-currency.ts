export type FormatCurrencyUnit = "euro" | "cent"

export interface FormatCurrencyOptions
  extends Omit<Intl.NumberFormatOptions, "currency" | "style"> {
  /** Défaut : `fr-FR`. */
  locale?: string
  /**
   * `euro` : `amount` est déjà en euros.
   * `cent` : centimes entiers (Stripe / champs Prisma en centimes) — divisé par 100 avant formatage.
   */
  unit?: FormatCurrencyUnit
}

const DEFAULT_LOCALE = "fr-FR"

/**
 * Formate un montant en euros pour l’affichage (EUR, locale française par défaut).
 */
export function formatCurrency(amount: number, options?: FormatCurrencyOptions): string {
  const { locale = DEFAULT_LOCALE, unit = "euro", ...intlOptions } = options ?? {}
  const amountEuros = unit === "cent" ? amount / 100 : amount
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    ...intlOptions,
  }).format(amountEuros)
}
