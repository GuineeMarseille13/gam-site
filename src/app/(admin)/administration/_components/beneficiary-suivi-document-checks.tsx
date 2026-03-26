"use client"

import { useCallback } from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BENEFICIARY_DOCUMENT_KEYS,
  BENEFICIARY_DOCUMENT_LABELS,
  type BeneficiaryDocumentKey,
} from "../_schemas/beneficiary-suivi-config"
import {
  BeneficiaryRequiredMark,
  beneficiarySuiviInputClassName,
} from "./beneficiary-suivi-form-classes"

interface BeneficiarySuiviDocumentChecksProps {
  value: readonly BeneficiaryDocumentKey[]
  onChange: (keys: BeneficiaryDocumentKey[]) => void
  /** Affiché lorsque « Autre » est coché. */
  otherDetail?: string
  onOtherDetailChange?: (value: string) => void
  otherDetailError?: string
  className?: string
}

/**
 * Cases à cocher « documents fournis » (aligné Google Form).
 */
export function BeneficiarySuiviDocumentChecks({
  value,
  onChange,
  otherDetail = "",
  onOtherDetailChange,
  otherDetailError,
  className,
}: BeneficiarySuiviDocumentChecksProps) {
  const selected = new Set(value)
  const hasOther = selected.has("OTHER")

  const toggle = useCallback(
    (key: BeneficiaryDocumentKey) => {
      const next = new Set(value)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      onChange(BENEFICIARY_DOCUMENT_KEYS.filter((k) => next.has(k)))
    },
    [onChange, value],
  )

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium leading-none text-foreground">Documents fournis</legend>
      <p className="text-xs text-muted-foreground">Cochez tout ce qui a été remis ou est attendu.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {BENEFICIARY_DOCUMENT_KEYS.map((key) => (
          <label
            key={key}
            className={cn(
              "flex cursor-pointer items-start gap-2 rounded-md border border-border/80 px-2 py-2 text-sm transition-colors hover:bg-sky-50/80 dark:hover:bg-sky-950/30",
              selected.has(key) && "border-sky-300/80 bg-sky-50/50 dark:border-sky-800 dark:bg-sky-950/40",
            )}
          >
            <Checkbox
              checked={selected.has(key)}
              onCheckedChange={() => {
                toggle(key)
              }}
              className="mt-0.5 border-sky-300 data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600 dark:data-[state=checked]:bg-sky-500"
              aria-label={BENEFICIARY_DOCUMENT_LABELS[key]}
            />
            <span className="leading-snug">{BENEFICIARY_DOCUMENT_LABELS[key]}</span>
          </label>
        ))}
      </div>

      {hasOther && onOtherDetailChange && (
        <div className="space-y-2 rounded-md border border-sky-200/60 bg-sky-50/40 px-3 py-3 dark:border-sky-900/50 dark:bg-sky-950/30">
          <Label htmlFor="ben-suivi-doc-other" className="text-sm font-medium text-foreground">
            Précision pour « Autre »
            <BeneficiaryRequiredMark />
          </Label>
          <Input
            id="ben-suivi-doc-other"
            value={otherDetail}
            onChange={(e) => onOtherDetailChange(e.target.value)}
            placeholder="Ex. attestation, extrait, document complémentaire…"
            className={cn(
              beneficiarySuiviInputClassName,
              "w-full min-w-0 max-w-full sm:max-w-2xl",
            )}
            aria-invalid={Boolean(otherDetailError)}
            aria-describedby={otherDetailError ? "ben-suivi-doc-other-error" : undefined}
          />
          {otherDetailError && (
            <p id="ben-suivi-doc-other-error" className="text-sm text-destructive">
              {otherDetailError}
            </p>
          )}
        </div>
      )}

      <Label className="sr-only">Documents fournis</Label>
    </fieldset>
  )
}
