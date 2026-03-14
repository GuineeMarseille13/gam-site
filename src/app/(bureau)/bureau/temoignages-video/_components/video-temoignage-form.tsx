"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SubmitButton } from "@/components/bureau/submit-button"
import type { ActionState } from "../_actions/actions"

interface VideoTemoignageFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    url?: string
    title?: string | null
    description?: string | null
    thumbnail?: string | null
    order?: number
    isActive?: boolean
  }
}

export function VideoTemoignageForm({ action, defaultValues }: VideoTemoignageFormProps) {
  const [state, formAction] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="url">URL de la vidéo *</Label>
        <Input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
          defaultValue={defaultValues?.url ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          Accepte les liens YouTube, Vimeo ou une URL directe (mp4, Cloudinary…)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          placeholder="Nom du témoin ou du témoignage"
          defaultValue={defaultValues?.title ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          placeholder="Courte description affichée sous la vignette"
          defaultValue={defaultValues?.description ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">URL de la vignette (miniature)</Label>
        <Input
          id="thumbnail"
          name="thumbnail"
          type="url"
          placeholder="https://... (optionnel, auto-générée pour YouTube)"
          defaultValue={defaultValues?.thumbnail ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          Pour YouTube, la miniature est automatiquement récupérée si ce champ est vide.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Ordre d&apos;affichage</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min="0"
          className="max-w-[120px]"
          defaultValue={defaultValues?.order ?? 0}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="isActive" name="isActive" defaultChecked={defaultValues?.isActive ?? true} />
        <Label htmlFor="isActive">Visible sur le site</Label>
      </div>

      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/temoignages-video">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
