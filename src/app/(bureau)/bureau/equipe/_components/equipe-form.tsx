"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SubmitButton } from "@/components/bureau/submit-button"
import { ImageIdField } from "@/components/bureau/image-id-field"

interface EquipeFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    firstName?: string
    lastName?: string
    email?: string | null
    phone?: string
    description?: string | null
    imageId?: string | null
    order?: number
    isActive?: boolean
  }
}

export function EquipeForm({ action, defaultValues }: EquipeFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input id="firstName" name="firstName" required defaultValue={defaultValues?.firstName ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input id="lastName" name="lastName" required defaultValue={defaultValues?.lastName ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone *</Label>
        <Input id="phone" name="phone" required defaultValue={defaultValues?.phone ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description / Rôle</Label>
        <Textarea id="description" name="description" rows={2} defaultValue={defaultValues?.description ?? ""} />
      </div>
      <ImageIdField defaultValue={defaultValues?.imageId} />
      <div className="space-y-2">
        <Label htmlFor="order">Ordre d&apos;affichage</Label>
        <Input id="order" name="order" type="number" min="0" defaultValue={defaultValues?.order ?? 0} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="isActive" name="isActive" defaultChecked={defaultValues?.isActive ?? true} />
        <Label htmlFor="isActive">Membre actif</Label>
      </div>
      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/equipe">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
