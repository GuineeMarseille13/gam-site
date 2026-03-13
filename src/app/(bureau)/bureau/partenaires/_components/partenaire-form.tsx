"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"
import { ImageIdField } from "@/components/bureau/image-id-field"

interface PartenaireFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    name?: string
    description?: string | null
    url?: string | null
    imageId?: string | null
  }
}

export function PartenaireForm({ action, defaultValues }: PartenaireFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
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
      <ImageIdField defaultValue={defaultValues?.imageId} />
      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/partenaires">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
