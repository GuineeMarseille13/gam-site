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
import type { ActionState } from "../_actions/actions"

interface PartenaireFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    name?: string
    description?: string | null
    url?: string | null
    imageId?: string | null
    published?: boolean
  }
}

export function PartenaireForm({ action, defaultValues }: PartenaireFormProps) {
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
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" name="name" required defaultValue={defaultValues?.name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Site web</Label>
        <Input id="url" name="url" type="url" defaultValue={defaultValues?.url ?? ""} placeholder="https://..." />
      </div>
      <ImageUploadField
        defaultValue={defaultValues?.imageId}
        label="Logo du partenaire"
      />

      {/* Visibilité */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Visible sur le site</p>
          <p className="text-xs text-muted-foreground">
            {published ? "Le partenaire est publié et visible par tous." : "Le partenaire est masqué au public."}
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
          <Link href="/bureau/partenaires">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
