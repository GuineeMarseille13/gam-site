"use client"

import { useActionState, useRef, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"
import type { ActionState } from "../_actions/actions"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

const MAX_MB = 10

function buildThumbUrl(imageId: string) {
  return cloudinaryImageUrl(imageId, "w_800,h_600,c_fill,q_auto,f_auto")
}

interface PoleFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    name?: string
    description?: string | null
    imageId?: string | null
  }
}

export function PoleForm({ action, defaultValues }: PoleFormProps) {
  const [state, formAction] = useActionState(action, null)

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
            <p className="text-sm font-medium text-foreground">Image du pôle</p>

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

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">
              Nom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name" name="name" required
              defaultValue={defaultValues?.name ?? ""}
              placeholder="Ex : Pôle éducation"
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description" name="description"
              rows={5}
              defaultValue={defaultValues?.description ?? ""}
              placeholder="Décrivez les activités et objectifs de ce pôle…"
              className="resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-3 border-t pt-5">
            <SubmitButton>Enregistrer</SubmitButton>
            <Button variant="ghost" asChild>
              <Link href="/bureau/poles">Annuler</Link>
            </Button>
          </div>
        </div>

      </div>
    </form>
  )
}
