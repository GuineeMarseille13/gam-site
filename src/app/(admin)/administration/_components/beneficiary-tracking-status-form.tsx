"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateBeneficiaryRequestStatus } from "../_actions/update-beneficiary-request-status"
import {
  BeneficiaryRequiredMark,
  beneficiarySuiviSelectTriggerClassName,
  beneficiarySuiviTextareaClassName,
  beneficiaryTrackingPrimaryButtonClassName,
  beneficiaryTrackingStatusCardClassName,
} from "./beneficiary-suivi-form-classes"
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_VALUES } from "../_schemas/beneficiary-suivi-config"
import type { BeneficiaryTrackingDetail } from "../_schemas/beneficiary-tracking.schema"
import { cn } from "@/lib/utils"

interface BeneficiaryTrackingStatusFormProps {
  detail: BeneficiaryTrackingDetail
}

/**
 * Formulaire : statut de la demande + commentaire (suivi).
 */
export function BeneficiaryTrackingStatusForm({ detail }: BeneficiaryTrackingStatusFormProps) {
  const router = useRouter()
  const [requestStatus, setRequestStatus] = useState(
    () => detail.requestStatus ?? "PENDING_DOCUMENTS",
  )
  const [statusComment, setStatusComment] = useState(detail.statusComment ?? "")
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    setRequestStatus(detail.requestStatus ?? "PENDING_DOCUMENTS")
    setStatusComment(detail.statusComment ?? "")
  }, [detail.id, detail.requestStatus, detail.statusComment, detail.updatedAt])

  const handleSubmit = useCallback(() => {
    setFormError(null)
    setFieldErrors({})
    startTransition(async () => {
      const res = await updateBeneficiaryRequestStatus({
        id: detail.id,
        requestStatus,
        statusComment: statusComment.trim() === "" ? undefined : statusComment,
      })
      if (res.success) {
        router.refresh()
        return
      }
      setFormError(res.error)
      if (res.fieldErrors) {
        const flat: Record<string, string> = {}
        for (const [k, v] of Object.entries(res.fieldErrors)) {
          if (v?.[0]) flat[k] = v[0]
        }
        setFieldErrors(flat)
      }
    })
  }, [detail.id, requestStatus, statusComment, router])

  const isDirty =
    requestStatus !== (detail.requestStatus ?? "PENDING_DOCUMENTS") ||
    statusComment.trim() !== (detail.statusComment ?? "").trim()

  return (
    <div className={beneficiaryTrackingStatusCardClassName}>
      <h2 className="text-base font-semibold text-sky-950 dark:text-sky-100">
        Statut de la demande
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="track-status" className="text-foreground">
            Statut
            <BeneficiaryRequiredMark />
          </Label>
          <Select
            value={requestStatus}
            onValueChange={(v) => setRequestStatus(v as typeof requestStatus)}
          >
            <SelectTrigger id="track-status" className={beneficiarySuiviSelectTriggerClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REQUEST_STATUS_VALUES.map((v) => (
                <SelectItem key={v} value={v}>
                  {REQUEST_STATUS_LABELS[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.requestStatus && (
            <p className="text-sm text-destructive">{fieldErrors.requestStatus}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="track-comment" className="text-muted-foreground">
          Commentaire de la demande
        </Label>
        <Textarea
          id="track-comment"
          rows={4}
          value={statusComment}
          onChange={(e) => setStatusComment(e.target.value)}
          placeholder="Suivi, prochaines étapes…"
          className={cn(beneficiarySuiviTextareaClassName, "min-h-[100px]")}
        />
        {fieldErrors.statusComment && (
          <p className="text-sm text-destructive">{fieldErrors.statusComment}</p>
        )}
      </div>
      {formError && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={pending || !isDirty}
        className={cn(
          beneficiaryTrackingPrimaryButtonClassName,
          "h-11 w-full gap-2 sm:h-10 sm:w-auto",
        )}
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Enregistrer le statut
      </Button>
    </div>
  )
}
