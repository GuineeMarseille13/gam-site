"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { DateTimePicker } from "@/components/bureau/date-time-picker"
import {
  IconPhoto, IconUpload, IconX, IconPlus,
  IconCalendar, IconMapPin, IconEye, IconEyeOff,
  IconLoader2, IconAlertCircle,
} from "@tabler/icons-react"
import type { ActionState } from "../_actions/actions"

const CLOUD_NAME = "df3ymbrqe"
const MAX_MB     = 10
const MAX_IMAGES = 10

function buildThumbUrl(imageId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_600,h_800,c_fill,q_auto,f_auto/${imageId}`
}

// ── Types ──────────────────────────────────────────────────────────────────────

type ExistingImage = { imageId: string }
type NewFile       = { file: File; preview: string }

interface EvenementFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    title?:       string
    description?: string | null
    location?:    string | null
    /** Date ou chaîne ISO (sérialisée depuis un Server Component) */
    startDate?:   Date | string | null
    endDate?:     Date | string | null
    published?:   boolean
    /** IDs Cloudinary des images existantes (galerie), ordonnées */
    imageIds?:    string[]
  }
}

// ── Composant ──────────────────────────────────────────────────────────────────

export function EvenementForm({ action, defaultValues }: EvenementFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError]   = useState<string | null>(null)

  // ── Visibilité
  const [published, setPublished] = useState(defaultValues?.published ?? false)

  // ── Galerie d'images
  const fileRef   = useRef<HTMLInputElement>(null)
  const [keptIds, setKeptIds]   = useState<string[]>(defaultValues?.imageIds ?? [])
  const [newFiles, setNewFiles] = useState<NewFile[]>([])
  const [sizeError, setSizeError] = useState<string | null>(null)

  const totalImages = keptIds.length + newFiles.length
  const canAddMore  = totalImages < MAX_IMAGES

  // Toutes les images dans l'ordre d'affichage
  const existingEntries: ExistingImage[] = keptIds.map((id) => ({ imageId: id }))

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files      = Array.from(e.target.files ?? [])
    const remaining  = MAX_IMAGES - totalImages
    const candidates = files.slice(0, remaining)

    const oversized = candidates.filter((f) => f.size > MAX_MB * 1024 * 1024)
    const valid     = candidates.filter((f) => f.size <= MAX_MB * 1024 * 1024)

    setSizeError(oversized.length > 0 ? `${oversized.length} fichier(s) ignoré(s) — taille max ${MAX_MB} Mo` : null)
    setNewFiles((prev) => [
      ...prev,
      ...valid.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
    ])
    e.target.value = ""
  }

  function removeExisting(imageId: string) {
    setKeptIds((prev) => prev.filter((id) => id !== imageId))
  }

  function removeNew(index: number) {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  // ── Soumission
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    // Injecter les images dans le FormData
    keptIds.forEach((id)  => formData.append("keptImageIds", id))
    newFiles.forEach(({file}) => formData.append("imageFiles", file))

    startTransition(async () => {
      const result = await action(null, formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      router.push("/bureau/evenements")
      router.refresh()
    })
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">

      {/* Erreur globale */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
          <IconAlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Galerie d'images ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Images de l&apos;événement</p>
            <p className="text-xs text-muted-foreground">
              La première image est utilisée comme couverture · {totalImages}/{MAX_IMAGES} image{totalImages !== 1 ? "s" : ""}
            </p>
          </div>
          {canAddMore && totalImages > 0 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <IconPlus className="size-3.5" />
              Ajouter
            </button>
          )}
        </div>

        {sizeError && (
          <p className="text-xs text-amber-600 dark:text-amber-400">{sizeError}</p>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />

        {totalImages === 0 ? (
          /* Zone vide — clic pour ajouter */
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer group flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/20 py-14 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl border border-dashed border-current opacity-40 transition-opacity group-hover:opacity-70">
              <IconPhoto className="size-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Cliquer pour ajouter des images</p>
              <p className="mt-0.5 text-xs opacity-60">JPG, PNG, WebP · max {MAX_MB} Mo · jusqu&apos;à {MAX_IMAGES} images</p>
            </div>
          </button>
        ) : (
          /* Grille galerie */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

            {/* Images existantes */}
            {existingEntries.map((img, i) => (
              <div key={img.imageId} className="group relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buildThumbUrl(img.imageId)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {/* Badge couverture */}
                {i === 0 && (
                  <div className="absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                    Couverture
                  </div>
                )}
                {/* Bouton supprimer */}
                <button
                  type="button"
                  onClick={() => removeExisting(img.imageId)}
                  className="cursor-pointer absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                  title="Supprimer"
                >
                  <IconX className="size-3.5" />
                </button>
              </div>
            ))}

            {/* Nouvelles images (preview local) */}
            {newFiles.map((f, i) => {
              const globalIndex = keptIds.length + i
              return (
                <div key={f.preview} className="group relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-primary/30 bg-muted shadow-sm ring-2 ring-primary/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.preview}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {/* Badge couverture */}
                  {globalIndex === 0 && (
                    <div className="absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      Couverture
                    </div>
                  )}
                  {/* Badge nouveau */}
                  <div className="absolute bottom-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
                    Nouveau
                  </div>
                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="cursor-pointer absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                    title="Supprimer"
                  >
                    <IconX className="size-3.5" />
                  </button>
                </div>
              )
            })}

            {/* Cellule "Ajouter" */}
            {canAddMore && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/60"
              >
                <div className="flex size-9 items-center justify-center rounded-full border border-dashed border-current opacity-50">
                  <IconPlus className="size-4" />
                </div>
                <span className="text-xs font-medium">Ajouter</span>
              </button>
            )}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          Format recommandé&nbsp;: portrait 3/4 · min. 800&nbsp;×&nbsp;1000&nbsp;px
        </p>
      </div>

      {/* ── Champs ──────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">

        {/* Colonne gauche — titre + description */}
        <div className="space-y-5 lg:col-span-3">

          {/* Titre */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Titre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title" name="title" required
              defaultValue={defaultValues?.title ?? ""}
              placeholder="Ex : Gala de bienfaisance 2026"
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
              placeholder="Décrivez l'événement en quelques lignes…"
              className="resize-none"
            />
          </div>
        </div>

        {/* Colonne droite — dates, lieu, visibilité */}
        <div className="space-y-5 lg:col-span-2">

          {/* Dates */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <IconCalendar className="size-4 text-muted-foreground" />
              Dates
            </div>
            <div className="grid grid-cols-1 gap-3">
              <DateTimePicker name="startDate" label="Début" defaultValue={defaultValues?.startDate ?? undefined} required />
              <DateTimePicker name="endDate"   label="Fin"   defaultValue={defaultValues?.endDate   ?? undefined} required />
            </div>
          </div>

          {/* Lieu */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <IconMapPin className="size-4 text-muted-foreground" />
              Lieu
            </div>
            <Input
              id="location" name="location"
              defaultValue={defaultValues?.location ?? ""}
              placeholder="Ex : Salle des fêtes, Paris"
              className="h-10"
            />
          </div>

          {/* Visibilité */}
          <div className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
            published ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-muted/20"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`flex size-9 items-center justify-center rounded-full ${
                published ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
              }`}>
                {published ? <IconEye className="size-4" /> : <IconEyeOff className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {published ? "Publié" : "Brouillon"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {published ? "Visible par tous sur le site" : "Non visible au public pour l'instant"}
                </p>
              </div>
            </div>
            <Switch checked={published} onCheckedChange={setPublished} />
            <input type="hidden" name="published" value={String(published)} />
          </div>
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 border-t pt-5">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-sm shadow-rose-500/20"
        >
          {isPending && <IconLoader2 className="size-4 animate-spin" />}
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={() => router.push("/bureau/evenements")}
          className="rounded-xl text-muted-foreground hover:text-foreground"
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
