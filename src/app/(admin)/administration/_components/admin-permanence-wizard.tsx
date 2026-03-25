"use client"

import { useCallback, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitPermanenceAdminPresenceVolunteer } from "../_actions/submit-permanence-admin-presence-volunteer"
import {
  ADMIN_PERMANENCE_MEMBERS,
  permanenceAdminPresenceVolunteerStep1Schema,
  permanenceAdminPresenceVolunteerStep2Schema,
  permanenceAdminPresenceVolunteerStep3Schema,
  submitPermanenceAdminPresenceVolunteerSchema,
} from "../_schemas/permanence-admin-presence-volunteer.schema"

const STEPS = 4

function toYmd(d: Date): string {
  return format(d, "yyyy-MM-dd")
}

interface AdminPermanenceWizardProps {
  className?: string
}

/**
 * Assistant multi-étapes : présence à la permanence administrative (ex-Google Form).
 */
export function AdminPermanenceWizard({ className }: AdminPermanenceWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [pending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const [permanenceDate, setPermanenceDate] = useState<Date | undefined>(undefined)
  const [memberFullName, setMemberFullName] = useState("")
  const [hoursPreset, setHoursPreset] = useState<"two" | "custom">("two")
  const [hoursCustom, setHoursCustom] = useState("")
  const [comment, setComment] = useState("")

  const resolvedHours = useMemo(() => {
    if (hoursPreset === "two") return 2
    const n = parseFloat(hoursCustom.replace(",", "."))
    if (Number.isNaN(n)) return null
    return n
  }, [hoursPreset, hoursCustom])

  const ymd = permanenceDate ? toYmd(permanenceDate) : ""

  const handleNext = useCallback(() => {
    setFormError(null)
    setFieldErrors({})
    if (step === 1) {
      const p = permanenceAdminPresenceVolunteerStep1Schema.safeParse({ permanenceDate: ymd })
      if (!p.success) {
        const e = p.error.flatten().fieldErrors
        setFieldErrors({ permanenceDate: e.permanenceDate?.[0] ?? "Date requise." })
        return
      }
    }
    if (step === 2) {
      const p = permanenceAdminPresenceVolunteerStep2Schema.safeParse({ memberFullName })
      if (!p.success) {
        const e = p.error.flatten().fieldErrors
        setFieldErrors({ memberFullName: e.memberFullName?.[0] ?? "Membre requis." })
        return
      }
    }
    if (step === 3) {
      const h = resolvedHours
      const p = permanenceAdminPresenceVolunteerStep3Schema.safeParse({ hours: h ?? 0 })
      if (!p.success || h === null) {
        setFieldErrors({
          hours: p.success ? "Indiquez une durée valide." : p.error.flatten().fieldErrors.hours?.[0] ?? "Durée invalide.",
        })
        return
      }
    }
    setStep((s) => Math.min(s + 1, STEPS))
  }, [step, ymd, memberFullName, resolvedHours])

  const handleBack = useCallback(() => {
    setFormError(null)
    setFieldErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleSubmit = useCallback(() => {
    const hours = resolvedHours
    const payload = {
      permanenceDate: ymd,
      memberFullName,
      hours: hours ?? 0,
      comment: comment.trim() === "" ? undefined : comment,
    }
    const parsed = submitPermanenceAdminPresenceVolunteerSchema.safeParse(payload)
    if (!parsed.success || hours === null) {
      setFormError("Vérifiez les informations avant envoi.")
      return
    }
    startTransition(async () => {
      const res = await submitPermanenceAdminPresenceVolunteer(parsed.data)
      if (res.success) {
        setDone(true)
        setStep(1)
        setPermanenceDate(undefined)
        setMemberFullName("")
        setHoursPreset("two")
        setHoursCustom("")
        setComment("")
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
  }, [ymd, memberFullName, comment, resolvedHours, router])

  if (done) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20",
          className,
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <Check className="size-7" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-foreground">Présence enregistrée</p>
          <p className="text-sm text-muted-foreground">
            La ligne apparaît dans le tableau ci-dessous. Vous pouvez saisir une autre permanence.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setDone(false)}
          className="mt-2 h-11 w-full max-w-sm bg-sky-600 text-white hover:bg-sky-700 sm:h-10"
        >
          Nouvelle saisie
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("min-w-0 space-y-6", className)}>
      <StepIndicator current={step} />

      {formError && (
        <p
          className="break-words rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {formError}
        </p>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <Label htmlFor="adm-perm-date">Date de la permanence administrative</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="adm-perm-date"
                type="button"
                variant="outline"
                className={cn(
                  "h-auto min-h-11 w-full max-w-full justify-start border-sky-200/80 px-3 py-2.5 text-left text-sm font-normal hover:border-sky-400 hover:bg-sky-50/90 hover:text-foreground sm:max-w-md sm:text-base dark:border-sky-800/60 dark:hover:border-sky-500 dark:hover:bg-sky-950/45",
                  !permanenceDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 size-4 shrink-0" aria-hidden />
                <span className="line-clamp-2 break-words text-left">
                  {permanenceDate
                    ? format(permanenceDate, "EEEE d MMMM yyyy", { locale: fr })
                    : "Choisir une date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[min(100vw-2rem,24rem)] max-w-[calc(100vw-2rem)] p-0 sm:w-auto sm:max-w-none"
              align="center"
              sideOffset={8}
            >
              <Calendar
                mode="single"
                selected={permanenceDate}
                onSelect={setPermanenceDate}
                locale={fr}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {fieldErrors.permanenceDate && (
            <p className="text-sm text-destructive">{fieldErrors.permanenceDate}</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <Label htmlFor="adm-perm-member">Membre</Label>
          <Select value={memberFullName} onValueChange={setMemberFullName}>
            <SelectTrigger
              id="adm-perm-member"
              className="h-11 w-full max-w-full border-sky-200/80 hover:border-sky-400 hover:bg-sky-50/90 dark:border-sky-800/60 dark:hover:border-sky-500 dark:hover:bg-sky-950/45 sm:max-w-md"
            >
              <SelectValue placeholder="Choisir dans la liste" />
            </SelectTrigger>
            <SelectContent className="max-h-[min(60vh,22rem)]">
              {ADMIN_PERMANENCE_MEMBERS.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.memberFullName && (
            <p className="text-sm text-destructive">{fieldErrors.memberFullName}</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Nombre d&apos;heures</legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant={hoursPreset === "two" ? "default" : "outline"}
                size="default"
                className={cn(
                  "h-11 min-h-11 w-full max-w-full sm:h-9 sm:min-h-0 sm:w-auto",
                  hoursPreset === "two"
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "border-sky-200/80 hover:border-sky-400 hover:bg-sky-50/90 dark:border-sky-800/60 dark:hover:border-sky-500 dark:hover:bg-sky-950/45",
                )}
                onClick={() => {
                  setHoursPreset("two")
                  setFieldErrors({})
                }}
              >
                2 heures
              </Button>
              <Button
                type="button"
                variant={hoursPreset === "custom" ? "default" : "outline"}
                size="default"
                className={cn(
                  "h-11 min-h-11 w-full max-w-full sm:h-9 sm:min-h-0 sm:w-auto",
                  hoursPreset === "custom"
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "border-sky-200/80 hover:border-sky-400 hover:bg-sky-50/90 dark:border-sky-800/60 dark:hover:border-sky-500 dark:hover:bg-sky-950/45",
                )}
                onClick={() => {
                  setHoursPreset("custom")
                  setFieldErrors({})
                }}
              >
                Autre durée
              </Button>
            </div>
          </fieldset>
          {hoursPreset === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="adm-perm-hours">Durée (heures)</Label>
              <Input
                id="adm-perm-hours"
                type="text"
                inputMode="decimal"
                placeholder="ex. 1,5"
                value={hoursCustom}
                onChange={(e) => setHoursCustom(e.target.value)}
                className="h-11 w-full min-w-0 max-w-full sm:max-w-xs"
              />
            </div>
          )}
          {fieldErrors.hours && <p className="text-sm text-destructive">{fieldErrors.hours}</p>}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border/80 bg-muted/30 p-4 text-sm">
            <p className="break-words">
              <span className="text-muted-foreground">Date : </span>
              <span className="font-medium">
                {permanenceDate ? format(permanenceDate, "d MMMM yyyy", { locale: fr }) : "—"}
              </span>
            </p>
            <p className="mt-2 break-words">
              <span className="text-muted-foreground">Membre : </span>
              <span className="font-medium">{memberFullName || "—"}</span>
            </p>
            <p className="mt-2 break-words">
              <span className="text-muted-foreground">Durée : </span>
              <span className="font-medium">
                {resolvedHours != null ? `${resolvedHours} h` : "—"}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adm-perm-comment">Commentaire (organisation ADM)</Label>
            <Textarea
              id="adm-perm-comment"
              rows={4}
              placeholder="Optionnel"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] w-full min-w-0 resize-y"
            />
            {fieldErrors.comment && (
              <p className="text-sm text-destructive">{fieldErrors.comment}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-start sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1 || pending}
          className="h-11 w-full max-w-full gap-1 hover:bg-sky-100/90 hover:text-foreground sm:h-10 sm:w-auto dark:hover:bg-sky-950/40"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Retour
        </Button>
        {step < STEPS ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={pending}
            className="h-11 w-full max-w-full gap-1 bg-sky-600 text-white hover:bg-sky-700 sm:h-10 sm:w-auto"
          >
            Suivant
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={pending}
            className="h-11 w-full max-w-full gap-2 bg-sky-600 text-white hover:bg-sky-700 sm:h-10 sm:min-w-[140px] sm:w-auto"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  )
}

function StepIndicator({ current }: { current: number }) {
  const labels = ["Date", "Membre", "Durée", "Validation"]
  return (
    <nav aria-label="Étapes du formulaire" className="w-full">
      <ol className="grid grid-cols-4 gap-1 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
        {labels.map((label, i) => {
          const n = i + 1
          const active = n === current
          const done = n < current
          return (
            <li
              key={label}
              className="flex min-w-0 flex-col items-center gap-1 sm:flex-1 sm:flex-row sm:gap-2"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-sky-600 text-white",
                  active && !done && "bg-sky-100 text-sky-800 ring-2 ring-sky-500 dark:bg-sky-950 dark:text-sky-100",
                  !active && !done && "bg-muted text-muted-foreground",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-4" aria-hidden /> : n}
              </span>
              <span
                className={cn(
                  "line-clamp-2 max-w-full text-center text-[10px] font-medium leading-tight sm:inline sm:max-w-[7rem] sm:truncate sm:text-left sm:text-xs",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
