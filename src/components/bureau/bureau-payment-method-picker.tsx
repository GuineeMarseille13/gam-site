"use client"

import { Banknote, CreditCard, Landmark } from "lucide-react"

import {
  BUREAU_PAYMENT_METHODS,
  BUREAU_PAYMENT_METHOD_LABELS,
  type BureauPaymentMethod,
} from "@/config/bureau-payment-methods"
import { cn } from "@/helpers/utils"

interface BureauPaymentMethodPickerProps {
  readonly value: BureauPaymentMethod | null
  readonly onChange: (method: BureauPaymentMethod) => void
  readonly className?: string
}

const METHOD_OPTIONS: ReadonlyArray<{
  readonly id: BureauPaymentMethod
  readonly icon: typeof Banknote
  readonly description: string
}> = [
  {
    id: BUREAU_PAYMENT_METHODS.espece,
    icon: Banknote,
    description: "Encaissement en caisse",
  },
  {
    id: BUREAU_PAYMENT_METHODS.virement,
    icon: Landmark,
    description: "Virement bancaire reçu",
  },
  {
    id: BUREAU_PAYMENT_METHODS.carte,
    icon: CreditCard,
    description: "Paiement Stripe sécurisé",
  },
]

/**
 * Sélecteur de mode de règlement (adhésions et dons bureau).
 */
export function BureauPaymentMethodPicker({
  value,
  onChange,
  className,
}: BureauPaymentMethodPickerProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {METHOD_OPTIONS.map((option) => {
        const Icon = option.icon
        const isSelected = value === option.id
        const label = BUREAU_PAYMENT_METHOD_LABELS[option.id]

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
              isSelected
                ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40"
                : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40",
            )}
          >
            <Icon
              className={cn(
                "size-5",
                isSelected ? "text-amber-600" : "text-muted-foreground",
              )}
              aria-hidden
            />
            <span className="font-medium text-sm text-foreground">{label}</span>
            <span className="text-muted-foreground text-xs leading-snug">
              {option.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
