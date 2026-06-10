"use client"

import { useCallback, useRef, useState } from "react"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"

import { cn } from "@/helpers/utils"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

type ImageVariant = "portrait" | "landscape"

interface AssociationImageUploadFieldProps {
  defaultValue?: string | null
  name?: string
  label: string
  helper?: string
  variant?: ImageVariant
  className?: string
}

const VARIANT_CONFIG: Record<
  ImageVariant,
  { aspect: string; transform: string; minHeight: string }
> = {
  portrait: {
    aspect: "aspect-[3/4]",
    transform: "w_480,h_640,c_fill,q_auto,f_auto",
    minHeight: "min-h-[300px]",
  },
  landscape: {
    aspect: "aspect-video",
    transform: "w_720,h_405,c_fill,q_auto,f_auto",
    minHeight: "min-h-[200px]",
  },
}

/**
 * Zone d'upload image moderne pour les pages Notre association (bureau).
 */
export function AssociationImageUploadField({
  defaultValue,
  name = "imageId",
  label,
  helper,
  variant = "landscape",
  className,
}: AssociationImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [existingId, setExistingId] = useState(defaultValue ?? "")
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const config = VARIANT_CONFIG[variant]
  const MAX_SIZE_MB = 10

  const applyFile = useCallback((file: File) => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setSizeError(
        `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum ${MAX_SIZE_MB} Mo.`,
      )
      return
    }
    if (!file.type.startsWith("image/")) {
      setSizeError("Le fichier doit être une image.")
      return
    }
    setSizeError(null)
    setPreview(URL.createObjectURL(file))
    setExistingId("")
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    applyFile(file)
  }

  function handleRemove() {
    setPreview(null)
    setExistingId("")
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) applyFile(file)
    },
    [applyFile],
  )

  const displaySrc =
    preview ?? (existingId ? cloudinaryImageUrl(existingId, config.transform) : null)

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-tight text-foreground">{label}</p>
        {helper ? (
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{helper}</p>
        ) : null}
      </div>

      <input type="hidden" name={name} value={existingId} />

      {sizeError ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{sizeError}</p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        name="imageFile"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {displaySrc ? (
        <div
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-md ring-1 ring-black/[0.03]",
            config.aspect,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displaySrc} alt="Aperçu" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
          <div className="absolute bottom-3 left-3 right-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg transition-transform hover:scale-[1.02]"
            >
              <IconUpload className="size-3.5" />
              Remplacer
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex cursor-pointer items-center rounded-full bg-white/95 p-2 text-foreground shadow-lg transition-transform hover:scale-[1.02]"
              aria-label="Supprimer l'image"
            >
              <IconX className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex w-full cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed px-4 py-10 transition-all duration-200",
            config.aspect,
            config.minHeight,
            isDragging
              ? "border-amber-500 bg-amber-50/80 scale-[1.01] dark:bg-amber-950/40"
              : "border-amber-300/40 bg-[radial-gradient(circle_at_center,var(--color-amber-500)/0.06,transparent_70%)] hover:border-amber-400/60 hover:bg-amber-50/40 dark:border-amber-800/30 dark:hover:bg-amber-950/25",
          )}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25">
            <IconPhoto className="size-7" />
          </div>
          <div className="relative space-y-1.5 text-center">
            <p className="text-sm font-semibold text-foreground">
              {isDragging ? "Déposez l'image ici" : "Ajouter une photo"}
            </p>
            <p className="text-xs text-muted-foreground">
              Glisser-déposer ou cliquer · JPG, PNG, WebP · max. {MAX_SIZE_MB} Mo
            </p>
          </div>
        </button>
      )}
    </div>
  )
}
