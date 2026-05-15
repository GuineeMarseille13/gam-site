"use client"

import { Banknote, CreditCard, Landmark } from "lucide-react"

import {
  BUREAU_ADHESION_PAYMENT_METHODS,
  BUREAU_ADHESION_PAYMENT_METHOD_LABELS,
  type BureauAdhesionPaymentMethod,
} from "../_schemas/bureau-adhesion-create.schema"
import { cn } from "@/helpers/utils"

const PAYMENT_OPTIONS: {
  readonly value: BureauAdhesionPaymentMethod
  readonly icon: typeof CreditCard
  readonly description: string
}[] = [
  {
    value: BUREAU_ADHESION_PAYMENT_METHODS.espece,
    icon: Banknote,
    description: "Paiement reçu en liquide sur place",
  },
  {
    value: BUREAU_ADHESION_PAYMENT_METHODS.virement,
    icon: Landmark,
    description: "Virement bancaire reçu ou attendu",
  },
  {
    value: BUREAU_ADHESION_PAYMENT_METHODS.carte,
    icon: CreditCard,
    description: "Encaissement par carte via Stripe",
  },
]

interface AdhesionPaymentMethodPickerProps {
  readonly value: BureauAdhesionPaymentMethod | null
  readonly onChange: (method: BureauAdhesionPaymentMethod) => void
}

/**
 * Sélection du mode de règlement (espèces, virement, carte).
 */
export function AdhesionPaymentMethodPicker({
  value,
  onChange,
}: AdhesionPaymentMethodPickerProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-foreground">
        Mode de règlement
      </legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {PAYMENT_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.value
          const label = BUREAU_ADHESION_PAYMENT_METHOD_LABELS[option.value]

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                "hover:border-amber-500/50 hover:bg-muted/40",
                isSelected
                  ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40"
                  : "border-border/60 bg-muted/15",
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  isSelected ? "text-amber-600" : "text-muted-foreground",
                )}
                aria-hidden
              />
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs text-muted-foreground leading-snug">
                {option.description}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
