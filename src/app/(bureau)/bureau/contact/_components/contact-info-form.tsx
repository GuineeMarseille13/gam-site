"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"

interface ContactInfoFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    phone?: string
    email?: string
    address?: string
    city?: string
    zipCode?: string
  }
}

export function ContactInfoForm({ action, defaultValues }: ContactInfoFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email ?? ""}
            placeholder="contact@exemple.fr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultValues?.phone ?? ""}
            placeholder="+33 6 00 00 00 00"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Rue et numéro</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaultValues?.address ?? ""}
          placeholder="2 Boulevard Louis Frangin"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Code postal</Label>
          <Input
            id="zipCode"
            name="zipCode"
            defaultValue={defaultValues?.zipCode ?? ""}
            placeholder="13005"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            defaultValue={defaultValues?.city ?? ""}
            placeholder="Marseille"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
