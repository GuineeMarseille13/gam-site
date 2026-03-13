"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SubmitButton } from "@/components/bureau/submit-button"
import { ImageIdField } from "@/components/bureau/image-id-field"

interface ProduitFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    title?: string
    description?: string | null
    price?: number
    stock?: number
    isActive?: boolean
    imageId?: string | null
    productCategoryId?: string | null
  }
  categories?: { id: string; title: string }[]
}

export function ProduitForm({ action, defaultValues, categories = [] }: ProduitFormProps) {
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
          <Label htmlFor="price">Prix (€) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaultValues?.price !== undefined ? (defaultValues.price / 100).toFixed(2) : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input id="stock" name="stock" type="number" min="0" required defaultValue={defaultValues?.stock ?? 0} />
        </div>
      </div>
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="productCategoryId">Catégorie</Label>
          <select
            id="productCategoryId"
            name="productCategoryId"
            defaultValue={defaultValues?.productCategoryId ?? ""}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">— Aucune catégorie —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
        </div>
      )}
      <ImageIdField defaultValue={defaultValues?.imageId} />
      <div className="flex items-center gap-2">
        <Checkbox id="isActive" name="isActive" defaultChecked={defaultValues?.isActive ?? true} />
        <Label htmlFor="isActive">Produit actif (visible en boutique)</Label>
      </div>
      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/produits">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
