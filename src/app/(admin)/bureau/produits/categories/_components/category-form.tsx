"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"
import type { ActionState } from "../_actions/actions"

interface CategoryFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    title?: string
    description?: string | null
  }
}

/**
 * Composant: CategoryForm
 * Rôle: Créer ou modifier une catégorie de produit (bureau).
 */
export function CategoryForm({ action, defaultValues }: CategoryFormProps) {
  const [state, formAction] = useActionState(action, null)

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <FormField
        id="title"
        label="Titre"
        required
        hint="Ex. : Vêtements, Accessoires, Goodies"
      >
        <Input
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title ?? ""}
          placeholder="Ex. : Vêtements"
          className="h-10 rounded-xl"
        />
      </FormField>

      <FormField
        id="description"
        label="Description"
        hint="Optionnel — visible uniquement en administration"
      >
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Courte description de la catégorie…"
          className="resize-none rounded-xl"
        />
      </FormField>

      <div className="flex flex-wrap gap-3 border-t pt-5">
        <SubmitButton intent="bureau" className="rounded-xl px-6">
          Enregistrer
        </SubmitButton>
        <Button variant="ghost" asChild className="rounded-xl">
          <Link href="/bureau/produits/categories">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}

function FormField({
  id,
  label,
  required,
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}
