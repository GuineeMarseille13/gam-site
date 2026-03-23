"use client"

import { useRef, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { IconCamera, IconX } from "@tabler/icons-react"

interface AvatarUploadProps {
  /** URL d'image existante (mode édition) */
  defaultImageUrl?: string | null
  /** Afficher le toggle "Afficher sur le site" */
  withVisibilityToggle?: boolean
  /** Valeur initiale du toggle */
  defaultShowOnSite?: boolean
  /** Couleur du fond avatar quand aucune image (classes Tailwind bg gradient) */
  placeholderClass?: string
  /** Sous-label optionnel pour préciser la section concernée (ex: "Section 'Nos bénévoles'") */
  visibilitySubLabel?: string
}

/**
 * Composant d'upload d'avatar circulaire.
 * - Transmet le fichier via `<input name="imageFile">`
 * - Transmet la visibilité via `<input name="showOnSite">` (si withVisibilityToggle)
 * - L'upload Cloudinary est géré côté serveur dans le Server Action
 */
export function AvatarUpload({
  defaultImageUrl,
  withVisibilityToggle = false,
  defaultShowOnSite = true,
  placeholderClass = "from-slate-100 to-slate-200 text-slate-500",
  visibilitySubLabel,
}: AvatarUploadProps) {
  const [preview, setPreview]         = useState<string | null>(defaultImageUrl ?? null)
  const [showOnSite, setShowOnSite]   = useState(defaultShowOnSite)
  const [sizeError, setSizeError]     = useState<string | null>(null)
  const [isDragging, setIsDragging]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function applyFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setSizeError("Fichier trop volumineux (max 10 Mo)")
      return
    }
    setSizeError(null)
    setPreview(URL.createObjectURL(file))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) applyFile(file)
  }

  function handleRemove() {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) applyFile(file)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {/* ── Zone avatar ───────────────────────────────────────────────────── */}
      <div className="relative shrink-0 group">
        <input
          ref={inputRef}
          type="file"
          name="imageFile"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Cercle cliquable + drag & drop */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "relative size-24 rounded-full overflow-hidden cursor-pointer",
            "ring-2 transition-all duration-200",
            isDragging
              ? "ring-violet-500 ring-offset-2 scale-105"
              : "ring-border/60 hover:ring-border",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          ].join(" ")}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${placeholderClass}`}>
              <IconCamera className="size-7 opacity-40" />
            </div>
          )}

          {/* Overlay au survol */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
            <IconCamera className="size-5 text-white" />
            <span className="text-[10px] text-white font-semibold tracking-wide">
              {preview ? "Modifier" : "Ajouter"}
            </span>
          </div>
        </button>

        {/* Bouton supprimer (×) */}
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-0.5 -right-0.5 size-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer shadow-md transition-colors"
            title="Supprimer la photo"
          >
            <IconX className="size-3.5" />
          </button>
        )}
      </div>

      {/* ── Infos + toggle ────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center gap-3 text-center sm:text-left">
        <div>
          <p className="text-sm font-semibold text-foreground">Photo de profil</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            JPG, PNG, WEBP &middot; Max 10 Mo
          </p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            Glissez-déposez ou cliquez pour choisir
          </p>
          {sizeError && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium">{sizeError}</p>
          )}
        </div>

        {/* Toggle visibilité */}
        {withVisibilityToggle && (
          <div className="flex items-center gap-2.5">
            <Switch
              id="showOnSite"
              checked={showOnSite}
              onCheckedChange={setShowOnSite}
            />
            {/* Input caché pour la soumission du formulaire */}
            <input type="hidden" name="showOnSite" value={showOnSite ? "true" : "false"} />
            <div>
              <Label
                htmlFor="showOnSite"
                className="text-xs text-muted-foreground cursor-pointer select-none"
              >
                Afficher sur le site
              </Label>
              {visibilitySubLabel && (
                <p className="text-[10px] text-muted-foreground/60 leading-tight">{visibilitySubLabel}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
