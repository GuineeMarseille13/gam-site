"use client"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"

const CLOUD_NAME = "df3ymbrqe"

function buildThumbUrl(imageId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_320,h_200,c_fill,q_auto,f_auto/${imageId}`
}

interface ImageUploadFieldProps {
  /** imageId Cloudinary existant (mode édition) */
  defaultValue?: string | null
  /** Nom du champ hidden pour l'imageId existant */
  name?: string
  /** Label affiché au-dessus du champ */
  label?: string
}

/**
 * Champ d'upload d'image.
 * - Sélection → aperçu local uniquement (aucun appel réseau)
 * - Le fichier est transmis via <input type="file" name="imageFile">
 * - L'upload Cloudinary se fait dans le Server Action au moment de "Enregistrer"
 */
export function ImageUploadField({
  defaultValue,
  name = "imageId",
  label = "Image",
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [existingId, setExistingId] = useState(defaultValue ?? "")
  const [sizeError, setSizeError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const MAX_SIZE_MB = 10

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setSizeError(`Le fichier est trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). La taille maximale autorisée est ${MAX_SIZE_MB} Mo.`)
      if (inputRef.current) inputRef.current.value = ""
      return
    }
    setSizeError(null)
    setPreview(URL.createObjectURL(file))
    setExistingId("")
  }

  function handleRemove() {
    setPreview(null)
    setExistingId("")
    if (inputRef.current) inputRef.current.value = ""
  }

  // Source d'affichage : blob local (nouveau) ou Cloudinary (existant)
  const displaySrc = preview ?? (existingId ? buildThumbUrl(existingId) : null)

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* imageId existant — vide si un nouveau fichier est sélectionné */}
      <input type="hidden" name={name} value={existingId} />

      {sizeError && (
        <p className="text-sm text-destructive">{sizeError}</p>
      )}

      {/* Fichier sélectionné — transmis au Server Action via FormData */}
      <input
        ref={inputRef}
        type="file"
        name="imageFile"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {displaySrc ? (
        <div className="relative w-40 h-24 overflow-hidden rounded-md border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displaySrc} alt="Aperçu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-end gap-1 p-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
              title="Changer l'image"
            >
              <IconUpload className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
              title="Supprimer l'image"
            >
              <IconX className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer flex h-24 w-40 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/70"
        >
          <IconPhoto className="h-5 w-5" />
          <span className="text-xs text-center px-2">Choisir une image</span>
        </button>
      )}
    </div>
  )
}
