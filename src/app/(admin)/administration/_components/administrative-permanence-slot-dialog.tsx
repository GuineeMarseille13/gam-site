"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"

import { upsertAdministrativePermanenceSlotAction } from "../_actions/manage-administrative-permanence"
import type { AdministrativePermanenceSlotRow } from "@/lib/administrative-permanence/administrative-permanence.schema"
import { saveAdministrativePermanenceSlotInputSchema } from "@/lib/administrative-permanence/administrative-permanence.schema"
import { dateToYmdLocal } from "@/lib/administrative-permanence/date-to-ymd-local"
import {
  administrationOutlineButtonClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface AdministrativePermanenceSlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: AdministrativePermanenceSlotRow | null
  onSaved: () => void
}

/**
 * Création ou édition d’un créneau (date + heures).
 */
export function AdministrativePermanenceSlotDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: AdministrativePermanenceSlotDialogProps) {
  const [pending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("14:00")
  const [endTime, setEndTime] = useState("16:00")

  useEffect(() => {
    if (!open) return
    setFormError(null)
    if (editing) {
      const parts = editing.date.split("-")
      if (parts.length === 3) {
        const yy = Number(parts[0])
        const mm = Number(parts[1])
        const dd = Number(parts[2])
        if (Number.isFinite(yy) && Number.isFinite(mm) && Number.isFinite(dd)) {
          setDate(new Date(yy, mm - 1, dd))
        }
      }
      setStartTime(editing.startTime)
      setEndTime(editing.endTime)
      return
    }
    const n = new Date()
    setDate(new Date(n.getFullYear(), n.getMonth(), n.getDate()))
    setStartTime("14:00")
    setEndTime("16:00")
  }, [open, editing])

  const handleSubmit = useCallback(() => {
    if (!date) {
      setFormError("Choisissez une date.")
      return
    }
    const payload = {
      ...(editing ? { id: editing.id } : {}),
      date: dateToYmdLocal(date),
      startTime,
      endTime,
    }
    const parsed = saveAdministrativePermanenceSlotInputSchema.safeParse(payload)
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors
      const msg =
        Object.values(first).flat()[0] ?? "Vérifiez les heures (format HH:mm, fin après début)."
      setFormError(msg)
      return
    }
    setFormError(null)
    startTransition(async () => {
      const res = await upsertAdministrativePermanenceSlotAction(parsed.data)
      if (!res.success) {
        setFormError(res.error)
        return
      }
      onSaved()
      onOpenChange(false)
    })
  }, [date, startTime, endTime, editing, onOpenChange, onSaved])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/60 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la permanence" : "Ajouter une permanence"}</DialogTitle>
          <DialogDescription>
            Jour libre (pas seulement le samedi) et plage horaire affichée sur le site public.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="perm-date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="perm-date"
                  type="button"
                  variant="outline"
                  className={cn(
                    administrationOutlineButtonClassName,
                    "h-11 w-full justify-start text-left font-normal",
                  )}
                >
                  <CalendarIcon className="mr-2 size-4 opacity-70" aria-hidden />
                  {date
                    ? format(date, "d MMMM yyyy", { locale: fr })
                    : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="perm-start">Début</Label>
              <Input
                id="perm-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="perm-end">Fin</Label>
              <Input
                id="perm-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-11"
              />
            </div>
          </div>
          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className={administrationOutlineButtonClassName}
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            className={administrationPrimaryButtonClassName}
            onClick={handleSubmit}
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
