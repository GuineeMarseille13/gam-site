"use client"

import { useRef, useState, useTransition } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconEye, IconEyeOff, IconLoader2, IconTag, IconCalendar, IconMapPin, IconAlignLeft } from "@tabler/icons-react"
import type { ActionState } from "../_actions/actions"

export interface BannerFormDefaults {
  isActive?: boolean
  badge?: string | null
  title?: string | null
  date?: string | null
  location?: string | null
}

interface BannerFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: BannerFormDefaults
  cancelHref?: string
}

export function BannerForm({ action, defaultValues, cancelHref = "/bureau/bandeau" }: BannerFormProps) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await action(null, fd)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Preview */}
      <div className="rounded-xl overflow-hidden border bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-2">Aperçu du bandeau</p>
        <div className="flex flex-wrap items-center gap-3 text-white text-sm font-medium">
          <BannerPreview formRef={formRef} defaults={defaultValues} />
        </div>
      </div>

      {/* Badge */}
      <div className="space-y-1.5">
        <Label htmlFor="badge" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconTag className="size-3.5" />Badge
        </Label>
        <Input id="badge" name="badge" defaultValue={defaultValues?.badge ?? ""} placeholder="Ex : Prochainement" className="h-9" />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconAlignLeft className="size-3.5" />Titre <span className="text-destructive">*</span>
        </Label>
        <Input id="title" name="title" required defaultValue={defaultValues?.title ?? ""} placeholder="Ex : Soirée Culturelle Guinéenne" className="h-9" />
      </div>

      {/* Date + Location */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="date" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconCalendar className="size-3.5" />Date affichée
          </Label>
          <Input id="date" name="date" defaultValue={defaultValues?.date ?? ""} placeholder="Ex : Samedi 15 Juin" className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconMapPin className="size-3.5" />Lieu
          </Label>
          <Input id="location" name="location" defaultValue={defaultValues?.location ?? ""} placeholder="Ex : Marseille — Salle des Fêtes" className="h-9" />
        </div>
      </div>

      {/* Visibility */}
      <div className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
        isActive ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-muted/20"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`flex size-9 items-center justify-center rounded-full ${
            isActive ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
          }`}>
            {isActive ? <IconEye className="size-4" /> : <IconEyeOff className="size-4" />}
          </div>
          <div>
            <p className="text-sm font-medium">{isActive ? "Actif — visible sur le site" : "Inactif — masqué"}</p>
            <p className="text-xs text-muted-foreground">
              {isActive ? "Le bandeau défile en bas de page" : "Le bandeau ne s'affiche pas"}
            </p>
          </div>
        </div>
        <Switch checked={isActive} onCheckedChange={setIsActive} />
        <input type="hidden" name="isActive" value={String(isActive)} />
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-5">
        <Button type="submit" disabled={pending} className="min-w-36">
          {pending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
          Enregistrer
        </Button>
        <Button variant="ghost" asChild disabled={pending}>
          <Link href={cancelHref}>Annuler</Link>
        </Button>
      </div>
    </form>
  )
}

// Live preview reading form values (static, no live update needed — just defaults)
function BannerPreview({ defaults }: { formRef: React.RefObject<HTMLFormElement | null>; defaults?: BannerFormDefaults }) {
  const badge = defaults?.badge
  const title = defaults?.title ?? "Titre du bandeau"
  const date = defaults?.date
  const location = defaults?.location

  return (
    <>
      {badge && (
        <span className="px-3 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full bg-white/25 border border-white/40">
          {badge}
        </span>
      )}
      <span className="font-bold">{title}</span>
      {date && <span className="text-white/90 text-xs">📅 {date}</span>}
      {location && <span className="text-white/90 text-xs">📍 {location}</span>}
    </>
  )
}
