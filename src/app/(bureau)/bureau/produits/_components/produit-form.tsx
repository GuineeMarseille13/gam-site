"use client"

import { useActionState, useRef, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SubmitButton } from "@/components/bureau/submit-button"
import {
  IconPhoto, IconUpload, IconX,
  IconTag, IconPackage, IconPercentage, IconShoppingBag,
} from "@tabler/icons-react"
import type { ActionState } from "../_actions/actions"

const CLOUD_NAME = "df3ymbrqe"
const MAX_MB = 10

function buildThumbUrl(imageId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,h_600,c_fill,q_auto,f_auto/${imageId}`
}

interface ProduitFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    title?: string
    description?: string | null
    price?: number
    stock?: number
    isActive?: boolean
    imageId?: string | null
    productCategoryId?: string | null
    discountActive?: boolean
    discountPercent?: number | null
  }
  categories?: { id: string; title: string }[]
}

export function ProduitForm({ action, defaultValues, categories = [] }: ProduitFormProps) {
  const [state, formAction] = useActionState(action, null)
  const [discountActive, setDiscountActive] = useState(defaultValues?.discountActive ?? false)
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true)

  const fileRef = useRef<HTMLInputElement>(null)
  const [preview,    setPreview]    = useState<string | null>(null)
  const [existingId, setExistingId] = useState(defaultValues?.imageId ?? "")
  const [sizeError,  setSizeError]  = useState<string | null>(null)

  const displaySrc = preview ?? (existingId ? buildThumbUrl(existingId) : null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) {
      setSizeError(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Max ${MAX_MB} Mo.`)
      e.target.value = ""
      return
    }
    setSizeError(null)
    setPreview(URL.createObjectURL(file))
    setExistingId("")
  }

  function handleRemove() {
    setPreview(null)
    setExistingId("")
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <form action={formAction} className="max-w-4xl">
      {state?.error && (
        <p className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">

        {/* ── Colonne image ─────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-3">
            <p className="text-sm font-medium text-foreground">Image du produit</p>

            <input ref={fileRef} type="file" name="imageFile" accept="image/*" className="hidden" onChange={handleFile} />
            <input type="hidden" name="imageId" value={existingId} />

            {sizeError && <p className="text-xs text-destructive">{sizeError}</p>}

            {displaySrc ? (
              <div className="group relative overflow-hidden rounded-2xl border bg-muted shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displaySrc}
                  alt="Aperçu"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-gray-900 shadow backdrop-blur-sm transition hover:bg-white"
                  >
                    <IconUpload className="size-3.5" />
                    Changer l&apos;image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/80"
                  >
                    <IconX className="size-3.5" />
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/60"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl border border-dashed border-current opacity-40 transition-opacity group-hover:opacity-70">
                  <IconPhoto className="size-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Cliquer pour choisir</p>
                  <p className="mt-0.5 text-xs opacity-60">JPG, PNG, WebP — max {MAX_MB} Mo</p>
                </div>
              </button>
            )}

            <p className="text-[11px] text-muted-foreground">
              Format recommandé : portrait 3/4 · min. 800 × 1000 px
            </p>
          </div>
        </div>

        {/* ── Colonne champs ────────────────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">

          {/* Titre */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Titre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title" name="title" required
              defaultValue={defaultValues?.title ?? ""}
              placeholder="Ex : T-shirt GAM"
              className="h-10"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description" name="description"
              rows={4}
              defaultValue={defaultValues?.description ?? ""}
              placeholder="Décrivez le produit…"
              className="resize-none"
            />
          </div>

          {/* Prix & Stock */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <IconTag className="size-4 text-muted-foreground" />
              Prix &amp; Stock
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs text-muted-foreground">
                  Prix de base (€) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price" name="price" type="number" step="0.01" min="0" required
                  defaultValue={defaultValues?.price !== undefined ? (defaultValues.price / 100).toFixed(2) : ""}
                  placeholder="0.00"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock" className="text-xs text-muted-foreground">
                  Stock <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock" name="stock" type="number" min="0" required
                  defaultValue={defaultValues?.stock ?? 0}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Réduction */}
          <div className={`space-y-3 rounded-xl border p-4 transition-colors ${
            discountActive ? "border-orange-200 bg-orange-50/50" : "border-border bg-muted/20"
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex size-9 items-center justify-center rounded-full ${
                  discountActive ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"
                }`}>
                  <IconPercentage className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Réduction</p>
                  <p className="text-xs text-muted-foreground">
                    {discountActive ? "Réduction active sur ce produit" : "Aucune réduction appliquée"}
                  </p>
                </div>
              </div>
              <Switch checked={discountActive} onCheckedChange={setDiscountActive} />
              <input type="hidden" name="discountActive" value={String(discountActive)} />
            </div>
            {discountActive && (
              <div className="space-y-1.5">
                <Label htmlFor="discountPercent" className="text-xs text-muted-foreground">
                  Pourcentage (%)
                </Label>
                <Input
                  id="discountPercent" name="discountPercent"
                  type="number" min="1" max="99" required
                  defaultValue={defaultValues?.discountPercent ?? ""}
                  placeholder="Ex : 20"
                  className="h-10 max-w-[140px]"
                />
              </div>
            )}
          </div>

          {/* Catégorie */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <IconPackage className="size-4 text-muted-foreground" />
                Catégorie
              </div>
              <select
                id="productCategoryId"
                name="productCategoryId"
                defaultValue={defaultValues?.productCategoryId ?? ""}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">— Aucune catégorie —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Visibilité boutique */}
          <div className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
            isActive ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-muted/20"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`flex size-9 items-center justify-center rounded-full ${
                isActive ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
              }`}>
                <IconShoppingBag className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isActive ? "Actif" : "Inactif"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isActive ? "Visible en boutique" : "Masqué de la boutique"}
                </p>
              </div>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <input type="hidden" name="isActive" value={String(isActive)} />
          </div>

          <div className="flex flex-wrap gap-3 border-t pt-5">
            <SubmitButton>Enregistrer</SubmitButton>
            <Button variant="ghost" asChild>
              <Link href="/bureau/produits">Annuler</Link>
            </Button>
          </div>
        </div>

      </div>
    </form>
  )
}
