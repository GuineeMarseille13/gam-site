"use client"

import {
  MAX_DON_AMOUNT_EUR,
  MIN_DON_AMOUNT_EUR,
  SUGGESTED_AMOUNTS,
  type DonPayload,
} from "@/app/(public)/don/_schemas/don.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/helpers/format-currency"
import { cn } from "@/helpers/utils"

interface DonDonorFieldsProps {
  readonly form: Partial<DonPayload>
  readonly customAmount: string
  readonly onFormChange: (form: Partial<DonPayload>) => void
  readonly onCustomAmountChange: (value: string) => void
}

/**
 * Formulaire donateur + montant (assistant bureau).
 */
export function DonDonorFields({
  form,
  customAmount,
  onFormChange,
  onCustomAmountChange,
}: DonDonorFieldsProps) {
  function updateField<K extends keyof DonPayload>(field: K, value: DonPayload[K]) {
    onFormChange({ ...form, [field]: value })
  }

  function handleSuggestedAmount(amount: number) {
    updateField("amount", amount)
    onCustomAmountChange("")
  }

  function handleCustomAmountChange(value: string) {
    onCustomAmountChange(value)
    const numValue = parseFloat(value.replace(",", "."))
    if (!Number.isNaN(numValue) && numValue > 0) {
      updateField("amount", numValue)
    } else {
      onFormChange({ ...form, amount: undefined })
    }
  }

  const selectedAmount = form.amount

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="don-firstName">Prénom</Label>
          <Input
            id="don-firstName"
            value={form.firstName ?? ""}
            onChange={(e) => updateField("firstName", e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="don-lastName">Nom</Label>
          <Input
            id="don-lastName"
            value={form.lastName ?? ""}
            onChange={(e) => updateField("lastName", e.target.value)}
            autoComplete="family-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="don-phone">Téléphone</Label>
          <Input
            id="don-phone"
            type="tel"
            value={form.phone ?? ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="06 12 34 56 78"
            autoComplete="tel"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="don-email">Email (optionnel)</Label>
          <Input
            id="don-email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => updateField("email", e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Montant du don</Label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                selectedAmount === amount &&
                  !customAmount &&
                  "border-amber-500 bg-amber-500/10 text-amber-700",
              )}
              onClick={() => handleSuggestedAmount(amount)}
            >
              {formatCurrency(amount, { maximumFractionDigits: 0 })}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            inputMode="decimal"
            placeholder={`Autre montant (${MIN_DON_AMOUNT_EUR}–${MAX_DON_AMOUNT_EUR} €)`}
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="max-w-xs"
          />
          {selectedAmount ? (
            <span className="text-muted-foreground text-sm tabular-nums">
              {formatCurrency(selectedAmount)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="don-message">Message (optionnel)</Label>
        <Textarea
          id="don-message"
          value={form.message ?? ""}
          onChange={(e) => updateField("message", e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Motivation, dédicace…"
        />
      </div>
    </div>
  )
}
