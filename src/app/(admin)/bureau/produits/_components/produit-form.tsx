"use client"

import { useActionState, useRef, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "@/components/bureau/submit-button"
import {
  IconPhoto,
  IconUpload,
  IconX,
  IconTag,
  IconPackage,
  IconPercentage,
  IconShoppingBag,
  IconExternalLink,
} from "@tabler/icons-react"
import { cn } from "@/helpers/utils"
import {
  bureauFormEmptyHintClassName,
  bureauFormIconVariants,
  bureauFormIconWrapVariants,
  bureauFormInlineLinkClassName,
  bureauFormManageLinkClassName,
  bureauFormSectionNeutral,
  bureauFormSectionVariants,
  bureauImageUploadHoverClassName,
  bureauSwitchVariants,
} from "@/config/bureau-form-theme"
import {
  bureauSelectContentClassName,
  bureauSelectItemClassName,
  bureauSelectTriggerClassName,
} from "@/config/bureau-select-theme"
import type { ActionState } from "../_actions/actions"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

const MAX_MB = 10
const CATEGORY_NONE = "__none__"

function buildThumbUrl(imageId: string) {
  return cloudinaryImageUrl(imageId, "w_800,h_600,c_fill,q_auto,f_auto")
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

/**
 * Composant: ProduitForm
 * Rôle: Création / édition d’un produit boutique (bureau).
 */
export function ProduitForm({ action, defaultValues, categories = [] }: ProduitFormProps) {
  const [state, formAction] = useActionState(action, null)
  const [discountActive, setDiscountActive] = useState(defaultValues?.discountActive ?? false)
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true)
  const [categoryId, setCategoryId] = useState(
    defaultValues?.productCategoryId ?? CATEGORY_NONE,
  )

  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [existingId, setExistingId] = useState(defaultValues?.imageId ?? "")
  const [sizeError, setSizeError] = useState<string | null>(null)

  const displaySrc = preview ?? (existingId ? buildThumbUrl(existingId) : null)
  const hasCategory = categoryId !== CATEGORY_NONE
  const selectedCategoryTitle =
    categories.find((c) => c.id === categoryId)?.title ?? "— Aucune catégorie —"

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
        <p className="mb-4 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive dark:bg-destructive/20 dark:text-red-300">
          {state.error}
        </p>
      )}

      <input
        type="hidden"
        name="productCategoryId"
        value={categoryId === CATEGORY_NONE ? "" : categoryId}
      />

      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-3">
            <p className="text-sm font-medium text-foreground">Image du produit</p>

            <input
              ref={fileRef}
              type="file"
              name="imageFile"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
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
                className={cn(
                  "group flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors",
                  bureauImageUploadHoverClassName,
                )}
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

        <div className="space-y-4 lg:col-span-3">
          <FormField label="Titre" htmlFor="title" required>
            <Input
              id="title"
              name="title"
              required
              defaultValue={defaultValues?.title ?? ""}
              placeholder="Ex : T-shirt GAM"
              className="h-10 rounded-xl"
            />
          </FormField>

          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={defaultValues?.description ?? ""}
              placeholder="Décrivez le produit…"
              className="resize-none rounded-xl"
            />
          </FormField>

          <FormSection
            className={bureauFormSectionNeutral}
            icon={<IconTag className="size-4 text-muted-foreground" />}
            title="Prix & Stock"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="Prix de base (€)" htmlFor="price" required subdued>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={
                    defaultValues?.price !== undefined
                      ? (defaultValues.price / 100).toFixed(2)
                      : ""
                  }
                  placeholder="0.00"
                  className="h-10 rounded-xl"
                />
              </FormField>
              <FormField label="Stock" htmlFor="stock" required subdued>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={defaultValues?.stock ?? 0}
                  className="h-10 rounded-xl"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            className={
              discountActive
                ? bureauFormSectionVariants.orange.active
                : bureauFormSectionVariants.orange.inactive
            }
            icon={
              <IconPercentage
                className={cn(
                  "size-4",
                  discountActive
                    ? bureauFormIconVariants.orange.active
                    : bureauFormIconVariants.orange.inactive,
                )}
              />
            }
            title="Réduction"
            description={
              discountActive ? "Réduction active sur ce produit" : "Aucune réduction appliquée"
            }
            trailing={
              <>
                <Switch
                  checked={discountActive}
                  onCheckedChange={setDiscountActive}
                  className={bureauSwitchVariants.orange}
                />
                <input type="hidden" name="discountActive" value={String(discountActive)} />
              </>
            }
            iconWrapClassName={
              discountActive
                ? bureauFormIconWrapVariants.orange.active
                : bureauFormIconWrapVariants.orange.inactive
            }
          >
            {discountActive && (
              <FormField label="Pourcentage (%)" htmlFor="discountPercent" required subdued>
                <Input
                  id="discountPercent"
                  name="discountPercent"
                  type="number"
                  min="1"
                  max="99"
                  required
                  defaultValue={defaultValues?.discountPercent ?? ""}
                  placeholder="Ex : 20"
                  className="h-10 max-w-[140px] rounded-xl"
                />
              </FormField>
            )}
          </FormSection>

          <FormSection
            className={
              hasCategory
                ? bureauFormSectionVariants.amber.active
                : bureauFormSectionVariants.amber.inactive
            }
            icon={
              <IconPackage
                className={cn(
                  "size-4",
                  hasCategory
                    ? bureauFormIconVariants.amber.active
                    : bureauFormIconVariants.amber.inactive,
                )}
              />
            }
            title="Catégorie"
            description={
              hasCategory ? selectedCategoryTitle : "Classement du produit en boutique"
            }
            trailing={
              <Button type="button" variant="ghost" size="sm" asChild className={bureauFormManageLinkClassName}>
                <Link href="/bureau/produits/categories">
                  Gérer
                  <IconExternalLink className="size-3.5 opacity-70" />
                </Link>
              </Button>
            }
            iconWrapClassName={
              hasCategory
                ? bureauFormIconWrapVariants.amber.active
                : bureauFormIconWrapVariants.amber.inactive
            }
          >
            {categories.length === 0 ? (
              <p className={bureauFormEmptyHintClassName}>
                Aucune catégorie disponible.{" "}
                <Link href="/bureau/produits/categories/nouveau" className={bureauFormInlineLinkClassName}>
                  Créer une catégorie
                </Link>
              </p>
            ) : (
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className={bureauSelectTriggerClassName}>
                  <SelectValue placeholder="Choisir une catégorie…">
                    {selectedCategoryTitle}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className={bureauSelectContentClassName}>
                  <SelectItem value={CATEGORY_NONE} className={bureauSelectItemClassName}>
                    — Aucune catégorie —
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className={bureauSelectItemClassName}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormSection>

          <FormSection
            className={
              isActive
                ? bureauFormSectionVariants.emerald.active
                : bureauFormSectionVariants.emerald.inactive
            }
            icon={
              <IconShoppingBag
                className={cn(
                  "size-4",
                  isActive
                    ? bureauFormIconVariants.emerald.active
                    : bureauFormIconVariants.emerald.inactive,
                )}
              />
            }
            title={isActive ? "Actif" : "Inactif"}
            description={isActive ? "Visible en boutique" : "Masqué de la boutique"}
            trailing={
              <>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className={bureauSwitchVariants.emerald}
                />
                <input type="hidden" name="isActive" value={String(isActive)} />
              </>
            }
            iconWrapClassName={
              isActive
                ? bureauFormIconWrapVariants.emerald.active
                : bureauFormIconWrapVariants.emerald.inactive
            }
          />

          <div className="flex flex-wrap gap-3 border-t border-border/60 pt-5">
            <SubmitButton intent="bureau" className="rounded-xl px-6">
              Enregistrer
            </SubmitButton>
            <Button variant="ghost" asChild className="rounded-xl">
              <Link href="/bureau/produits">Annuler</Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

function FormField({
  label,
  htmlFor,
  required,
  subdued,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  subdued?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className={cn(
          subdued
            ? "text-xs text-muted-foreground"
            : "text-sm font-medium text-foreground",
        )}
      >
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  )
}

function FormSection({
  className,
  icon,
  iconWrapClassName,
  title,
  description,
  trailing,
  children,
}: {
  className?: string
  icon: React.ReactNode
  iconWrapClassName?: string
  title: string
  description?: string
  trailing?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className={cn("space-y-3 rounded-xl border p-4 transition-colors", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              iconWrapClassName,
            )}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{title}</p>
            {description && (
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {trailing}
      </div>
      {children}
    </div>
  )
}
