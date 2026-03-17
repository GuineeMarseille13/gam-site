"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"

interface SocialMediaFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    name?: string | null
    url?: string | null
    icon?: string | null
    order?: number
  }
}

export function SocialMediaForm({ action, defaultValues }: SocialMediaFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du réseau</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues?.name ?? ""}
            placeholder="ex: Facebook, Instagram…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Identifiant icône</Label>
          <Input
            id="icon"
            name="icon"
            defaultValue={defaultValues?.icon ?? ""}
            placeholder="facebook · instagram · tiktok · linkedin · youtube · whatsapp · twitter"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL du profil</Label>
        <Input
          id="url"
          name="url"
          type="url"
          defaultValue={defaultValues?.url ?? ""}
          placeholder="https://facebook.com/votre-page"
        />
      </div>
      <div className="space-y-2 max-w-[10rem]">
        <Label htmlFor="order">Ordre d&apos;affichage</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min="0"
          defaultValue={defaultValues?.order ?? 0}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/contact">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
