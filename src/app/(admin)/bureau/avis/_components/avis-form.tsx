"use client"

import { useActionState, useRef, useState } from "react"
import Link from "next/link"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"
import type { AvisActionState } from "../_actions/actions"
import type { AvisSourceType } from "../_schemas/avis-form.schema"
import { AvisSourceField } from "./avis-source-field"

const MAX_MB = 10

interface AvisFormProps {
  action: (prev: AvisActionState, formData: FormData) => Promise<AvisActionState>
  defaultValues?: {
    firstName?: string
    lastName?: string
    body?: string
    rating?: number
    order?: number
    isActive?: boolean
    isVerified?: boolean
    avatarUrl?: string | null
    sourceType?: AvisSourceType
    sourceLabel?: string | null
    sourceImageUrl?: string | null
  }
}

/**
 * Formulaire création / édition d’un avis affiché sur la page d’accueil.
 */
export function AvisForm({ action, defaultValues }: AvisFormProps) {
  const [state, formAction] = useActionState(action, null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const existingAvatar = defaultValues?.avatarUrl?.trim() ?? ""
  const displaySrc = preview ?? existingAvatar

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
  }

  function handleRemovePreview() {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <form action={formAction} className="max-w-4xl space-y-8">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-3">
          <p className="text-sm font-medium text-foreground">Photo (optionnel)</p>
          <input ref={fileRef} type="file" name="imageFile" accept="image/*" className="hidden" onChange={handleFile} />
          {existingAvatar ? <input type="hidden" name="existingAvatarUrl" value={existingAvatar} /> : null}
          {sizeError ? <p className="text-xs text-destructive">{sizeError}</p> : null}

          {displaySrc ? (
            <div className="group relative overflow-hidden rounded-2xl border bg-muted shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displaySrc} alt="" className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-xs font-medium text-foreground shadow-sm border border-border/60"
                >
                  <IconUpload className="size-3.5" />
                  Changer
                </button>
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-xs font-medium text-destructive shadow-sm border border-border/60"
                >
                  <IconX className="size-3.5" />
                  Retirer le fichier
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/45 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10"
            >
              <IconPhoto className="size-10 opacity-50" />
              <span className="text-sm font-medium">Ajouter une photo</span>
            </button>
          )}

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Ou URL d’image</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              placeholder="https://…"
              defaultValue={defaultValues?.avatarUrl ?? ""}
            />
          </div>

          {existingAvatar ? (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="removeAvatar"
                className="size-4 rounded border border-input accent-primary"
              />
              <span className="text-sm text-muted-foreground">Supprimer la photo affichée</span>
            </label>
          ) : null}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" required defaultValue={defaultValues?.firstName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" required defaultValue={defaultValues?.lastName ?? ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Témoignage</Label>
            <Textarea
              id="body"
              name="body"
              required
              rows={6}
              className="min-h-[140px] resize-y"
              defaultValue={defaultValues?.body ?? ""}
              placeholder="Texte affiché sur le site public…"
            />
          </div>

          <AvisSourceField
            defaultSourceType={defaultValues?.sourceType ?? "none"}
            defaultSourceLabel={defaultValues?.sourceLabel}
            defaultSourceImageUrl={defaultValues?.sourceImageUrl}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rating">Note</Label>
              <select
                id="rating"
                name="rating"
                defaultValue={String(defaultValues?.rating ?? 5)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Ordre</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min={0}
                defaultValue={defaultValues?.order ?? 0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={defaultValues?.isActive ?? true}
                className="size-4 rounded border border-input accent-primary"
              />
              <span className="text-sm">Visible sur la page d’accueil</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="isVerified"
                defaultChecked={defaultValues?.isVerified ?? true}
                className="size-4 rounded border border-input accent-primary"
              />
              <span className="text-sm">Avis vérifié / validé</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/avis">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
