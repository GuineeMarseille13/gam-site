"use client"

import { useRef, useState } from "react"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/helpers/utils"
import { ReviewSourceLine } from "@/components/review-source-line"
import type { AvisSourceType } from "../_schemas/avis-form.schema"

const MAX_MB = 5

const SOURCE_OPTIONS: { value: AvisSourceType; label: string }[] = [
  { value: "none", label: "Aucune" },
  { value: "text", label: "Texte seul" },
  { value: "image", label: "Logo + texte" },
]

interface AvisSourceFieldProps {
  defaultSourceType?: AvisSourceType
  defaultSourceLabel?: string | null
  defaultSourceImageUrl?: string | null
}

/**
 * Champ origine de l’avis : « Avis de [logo] Google » ou texte seul.
 */
export function AvisSourceField({
  defaultSourceType = "none",
  defaultSourceLabel = null,
  defaultSourceImageUrl = null,
}: AvisSourceFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [sourceType, setSourceType] = useState<AvisSourceType>(defaultSourceType)
  const [sourceLabel, setSourceLabel] = useState(defaultSourceLabel ?? "")
  const [preview, setPreview] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const existingImage = defaultSourceImageUrl?.trim() ?? ""
  const displaySrc = preview ?? existingImage
  const previewLabel = sourceLabel.trim() || null
  const previewImage = displaySrc || null
  const hasPreview = sourceType !== "none" && (previewLabel || previewImage)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) {
      setSizeError(`Fichier trop volumineux. Max ${MAX_MB} Mo.`)
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
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Origine de l’avis</p>
        <p className="text-xs text-muted-foreground">
          Affiche « Avis de » sous le nom — avec un logo, un texte, ou les deux (ex. logo Google + « Google »).
        </p>
      </div>

      <input type="hidden" name="sourceType" value={sourceType} readOnly />

      <div className="flex flex-wrap gap-2">
        {SOURCE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSourceType(option.value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              sourceType === option.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {sourceType === "text" ? (
        <div className="space-y-2">
          <Label htmlFor="sourceLabel">Nom affiché après « Avis de »</Label>
          <Input
            id="sourceLabel"
            name="sourceLabel"
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
            placeholder="ex. Google, Facebook, Trustpilot…"
          />
        </div>
      ) : null}

      {sourceType === "image" ? (
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            name="sourceImageFile"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          {existingImage ? (
            <input type="hidden" name="existingSourceImageUrl" value={existingImage} />
          ) : null}
          {sizeError ? <p className="text-xs text-destructive">{sizeError}</p> : null}

          {displaySrc ? (
            <div className="group relative inline-flex overflow-hidden rounded-lg border bg-background p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displaySrc} alt="" className="h-8 max-w-[140px] object-contain" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-full border bg-background/95 px-2 py-1 text-xs font-medium shadow-sm"
                >
                  <IconUpload className="size-3" />
                  Changer
                </button>
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="inline-flex items-center gap-1 rounded-full border bg-background/95 px-2 py-1 text-xs font-medium text-destructive shadow-sm"
                >
                  <IconX className="size-3" />
                  Retirer
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-16 w-full max-w-xs items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary/45 hover:text-foreground"
            >
              <IconPhoto className="size-5 opacity-50" />
              <span className="text-sm">Ajouter un logo</span>
            </button>
          )}

          <div className="space-y-2">
            <Label htmlFor="sourceImageUrl">Ou URL du logo</Label>
            <Input
              id="sourceImageUrl"
              name="sourceImageUrl"
              type="url"
              placeholder="https://…"
              defaultValue={defaultSourceImageUrl ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceLabelImage">Nom affiché à côté du logo</Label>
            <Input
              id="sourceLabelImage"
              name="sourceLabel"
              value={sourceLabel}
              onChange={(e) => setSourceLabel(e.target.value)}
              placeholder="ex. Google"
            />
            <p className="text-xs text-muted-foreground">
              Recommandé pour le rendu « Avis de [logo] Google ».
            </p>
          </div>

          {existingImage ? (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="removeSourceImage"
                className="size-4 rounded border border-input accent-primary"
              />
              <span className="text-sm text-muted-foreground">Supprimer le logo affiché</span>
            </label>
          ) : null}
        </div>
      ) : null}

      {hasPreview ? (
        <div className="rounded-lg border border-dashed border-border/80 bg-background px-4 py-3">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Aperçu
          </p>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-600 text-sm font-semibold text-white">
              A
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-medium text-foreground">Prénom Nom</p>
              <ReviewSourceLine
                sourceLabel={previewLabel}
                sourceImageUrl={previewImage}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
