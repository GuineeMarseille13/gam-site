"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"
import { ImageIdField } from "@/components/bureau/image-id-field"

function toDatetimeLocal(date?: Date | null): string {
  if (!date) return ""
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

interface EvenementFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    title?: string
    description?: string | null
    location?: string | null
    imageId?: string | null
    startDate?: Date | null
    endDate?: Date | null
  }
}

export function EvenementForm({ action, defaultValues }: EvenementFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input id="title" name="title" required defaultValue={defaultValues?.title ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début *</Label>
          <Input id="startDate" name="startDate" type="datetime-local" required defaultValue={toDatetimeLocal(defaultValues?.startDate)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin *</Label>
          <Input id="endDate" name="endDate" type="datetime-local" required defaultValue={toDatetimeLocal(defaultValues?.endDate)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Lieu</Label>
        <Input id="location" name="location" defaultValue={defaultValues?.location ?? ""} />
      </div>
      <ImageIdField defaultValue={defaultValues?.imageId} />
      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/evenements">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
