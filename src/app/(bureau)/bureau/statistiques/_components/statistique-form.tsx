"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SubmitButton } from "@/components/bureau/submit-button"

interface StatistiqueFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    label?: string | null
    value?: number | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
  }
}

export function StatistiqueForm({ action, defaultValues }: StatistiqueFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="label">Libellé</Label>
        <Input id="label" name="label" defaultValue={defaultValues?.label ?? ""} placeholder="ex: Étudiants accompagnés" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Valeur numérique</Label>
          <Input id="value" name="value" type="number" min="0" defaultValue={defaultValues?.value ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Ordre d&apos;affichage</Label>
          <Input id="order" name="order" type="number" min="0" defaultValue={defaultValues?.order ?? 0} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icône (emoji)</Label>
          <Input id="icon" name="icon" defaultValue={defaultValues?.icon ?? ""} placeholder="ex: 🎓" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Couleur</Label>
          <Input id="color" name="color" defaultValue={defaultValues?.color ?? ""} placeholder="ex: amber, blue, green" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="isActive" name="isActive" defaultChecked={defaultValues?.isActive ?? true} />
        <Label htmlFor="isActive">Visible sur le site</Label>
      </div>
      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/statistiques">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
