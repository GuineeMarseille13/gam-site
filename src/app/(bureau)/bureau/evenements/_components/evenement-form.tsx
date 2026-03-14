"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SubmitButton } from "@/components/bureau/submit-button"
import { ImageUploadField } from "@/components/bureau/image-upload-field"
import { DateTimePicker } from "@/components/bureau/date-time-picker"
import type { ActionState } from "../_actions/actions"

interface EvenementFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    title?: string
    description?: string | null
    location?: string | null
    imageId?: string | null
    startDate?: Date | null
    endDate?: Date | null
    published?: boolean
  }
}

export function EvenementForm({ action, defaultValues }: EvenementFormProps) {
  const [state, formAction] = useActionState(action, null)
  const [published, setPublished] = useState(defaultValues?.published ?? false)

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input id="title" name="title" required defaultValue={defaultValues?.title ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DateTimePicker name="startDate" label="Date de début" defaultValue={defaultValues?.startDate} required />
        <DateTimePicker name="endDate" label="Date de fin" defaultValue={defaultValues?.endDate} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Lieu</Label>
        <Input id="location" name="location" defaultValue={defaultValues?.location ?? ""} />
      </div>
      <ImageUploadField
        defaultValue={defaultValues?.imageId}
        label="Image de l'événement"
      />

      {/* Visibilité */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Visible sur le site</p>
          <p className="text-xs text-muted-foreground">
            {published ? "L'événement est publié et visible par tous." : "L'événement est masqué au public."}
          </p>
        </div>
        <Switch
          checked={published}
          onCheckedChange={setPublished}
        />
        <input type="hidden" name="published" value={String(published)} />
      </div>

      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/evenements">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
