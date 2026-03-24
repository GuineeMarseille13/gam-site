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
  IconPhoto, IconX, IconPlus,
  IconCalendar, IconMapPin, IconEye, IconEyeOff,
  IconLoader2, IconAlertCircle, IconVideo,
} from "@tabler/icons-react"
import { isValidVideoUrl, parseVideoUrl } from "@/lib/video-urls"
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

const MAX_VIDEOS = 5

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
    /** URLs vidéo existantes (YouTube, Vimeo) */
    videoUrls?:   string[]
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

  // ── Liens vidéo (YouTube, Vimeo)
  const [videoUrls, setVideoUrls] = useState<string[]>(defaultValues?.videoUrls ?? [])
  const [videoInput, setVideoInput] = useState("")
  const [videoError, setVideoError] = useState<string | null>(null)
  const canAddVideo = videoUrls.length < MAX_VIDEOS

  function addVideoUrl() {
    const url = videoInput.trim()
    setVideoError(null)
    if (!url) return
    if (!isValidVideoUrl(url)) {
      setVideoError("URL invalide. Utilisez un lien YouTube ou Vimeo.")
      return
    }
    if (videoUrls.includes(url)) {
      setVideoError("Cette vidéo est déjà ajoutée.")
      return
    }
    setVideoUrls((prev) => [...prev, url])
    setVideoInput("")
  }

  function removeVideoUrl(index: number) {
    setVideoUrls((prev) => prev.filter((_, i) => i !== index))
    setVideoError(null)
  }

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
    // Injecter les liens vidéo
    videoUrls.forEach((url) => formData.append("videoUrls", url))

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
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">

      {/* Erreur globale */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/80 px-5 py-4 text-sm text-rose-700 shadow-sm dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-300">
          <IconAlertCircle className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Galerie d'images ──────────────────────────────────────── */}
      <section className="space-y-4">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Images de l&apos;événement</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              La première image sert de couverture · {totalImages}/{MAX_IMAGES} image{totalImages !== 1 ? "s" : ""}
            </p>
          </div>
          {canAddMore && totalImages > 0 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer mt-2 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/50 hover:text-foreground hover:border-muted-foreground/20"
            >
              <IconPlus className="size-4" />
              Ajouter
            </button>
          )}
        </header>

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
            className="cursor-pointer group flex w-full flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 py-16 text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-muted/20 hover:border-primary/20"
          >
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/30 transition-colors group-hover:bg-primary/10">
              <IconPhoto className="size-8 text-muted-foreground transition-colors group-hover:text-primary/70" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">Cliquer pour ajouter des images</p>
              <p className="text-xs text-muted-foreground/80">JPG, PNG, WebP · max {MAX_MB} Mo · jusqu&apos;à {MAX_IMAGES} images</p>
            </div>
          </button>
        ) : (
          /* Grille galerie */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

            {/* Images existantes */}
            {existingEntries.map((img, i) => (
              <div key={img.imageId} className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm transition-shadow hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buildThumbUrl(img.imageId)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {/* Badge couverture */}
                {i === 0 && (
                  <div className="absolute left-2 top-2 rounded-lg bg-amber-500/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur-sm">
                    Couverture
                  </div>
                )}
                {/* Bouton supprimer */}
                <button
                  type="button"
                  onClick={() => removeExisting(img.imageId)}
                  className="cursor-pointer absolute right-2 top-2 flex size-7 items-center justify-center rounded-xl bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-red-500"
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
                <div key={f.preview} className="group relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-primary/25 bg-muted/30 shadow-sm ring-1 ring-primary/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.preview}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {/* Badge couverture */}
                  {globalIndex === 0 && (
                    <div className="absolute left-2 top-2 rounded-lg bg-amber-500/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                      Couverture
                    </div>
                  )}
                  {/* Badge nouveau */}
                  <div className="absolute bottom-2 left-2 rounded-lg bg-primary/95 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg backdrop-blur-sm">
                    Nouveau
                  </div>
                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="cursor-pointer absolute right-2 top-2 flex size-7 items-center justify-center rounded-xl bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-red-500"
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
                className="cursor-pointer flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted/20"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted/40 transition-colors group-hover:bg-primary/10">
                  <IconPlus className="size-5" />
                </div>
                <span className="text-xs font-medium">Ajouter</span>
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground/80">
          Format recommandé&nbsp;: portrait 3/4 · min. 800&nbsp;×&nbsp;1000&nbsp;px
        </p>
      </section>

      {/* ── Liens vidéo ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <header>
          <h3 className="text-sm font-semibold text-foreground">Vidéos de l&apos;événement</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            YouTube, Vimeo · {videoUrls.length}/{MAX_VIDEOS} vidéo{videoUrls.length !== 1 ? "s" : ""}
          </p>
        </header>

        {videoError && (
          <p className="text-xs text-amber-600 dark:text-amber-400">{videoError}</p>
        )}

        {/* Champ d'ajout */}
        {canAddVideo && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative flex-1">
              <IconVideo className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="url"
                value={videoInput}
                onChange={(e) => {
                  setVideoInput(e.target.value)
                  setVideoError(null)
                }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVideoUrl())}
                placeholder="https://www.youtube.com/watch?v=… ou https://vimeo.com/…"
                className="h-11 pl-10 rounded-xl border-border/80 bg-muted/5 focus-visible:ring-2"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVideoUrl}
              className="gap-2 shrink-0 rounded-xl border-border/80 h-11 px-5 font-medium"
            >
              <IconPlus className="size-4" />
              Ajouter
            </Button>
          </div>
        )}

        {/* Liste des vidéos avec miniatures */}
        {videoUrls.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {videoUrls.map((url, index) => {
              const parsed = parseVideoUrl(url)
              return (
                <div
                  key={`${url}-${index}`}
                  className="group relative flex gap-4 rounded-2xl border border-border/50 bg-muted/5 p-4 transition-all duration-200 hover:bg-muted/15 hover:border-border/80 hover:shadow-sm"
                >
                  {parsed && (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted/30 ring-1 ring-border/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={parsed.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <IconVideo className="size-6 text-white/90" />
                      </div>
                      <span className="absolute bottom-1.5 left-1.5 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        {parsed.platform === "youtube" ? "YouTube" : "Vimeo"}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="truncate text-xs font-medium text-foreground">Vidéo {index + 1}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground" title={url}>
                      {url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideoUrl(index)}
                    className="absolute right-3 top-3 flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    title="Supprimer"
                  >
                    <IconX className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Champs ──────────────────────────────────────────────────── */}
      <section className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        <div className="space-y-6 lg:col-span-3">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Titre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title" name="title" required
              defaultValue={defaultValues?.title ?? ""}
              placeholder="Ex : Gala de bienfaisance 2026"
              className="h-11 rounded-xl border-border/80 bg-muted/5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description" name="description"
              rows={5}
              defaultValue={defaultValues?.description ?? ""}
              placeholder="Décrivez l'événement en quelques lignes…"
              className="resize-none rounded-xl border-border/80 bg-muted/5 min-h-[120px]"
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <IconCalendar className="size-4 text-muted-foreground" />
              Dates
            </div>
            <div className="grid grid-cols-1 gap-3">
              <DateTimePicker name="startDate" label="Début" defaultValue={defaultValues?.startDate ?? undefined} required />
              <DateTimePicker name="endDate"   label="Fin"   defaultValue={defaultValues?.endDate   ?? undefined} required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <IconMapPin className="size-4 text-muted-foreground" />
              Lieu
            </div>
            <Input
              id="location" name="location"
              defaultValue={defaultValues?.location ?? ""}
              placeholder="Ex : Salle des fêtes, Paris"
              className="h-11 rounded-xl border-border/80 bg-muted/5"
            />
          </div>

          <div className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ${
            published
              ? "border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-800/50 dark:bg-emerald-950/20"
              : "border-border/60 bg-muted/10 dark:bg-muted/5"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                published ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" : "bg-muted text-muted-foreground"
              }`}>
                {published ? <IconEye className="size-5" /> : <IconEyeOff className="size-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {published ? "Publié" : "Brouillon"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {published ? "Visible par tous sur le site" : "Non visible au public pour l'instant"}
                </p>
              </div>
            </div>
            <Switch checked={published} onCheckedChange={setPublished} />
            <input type="hidden" name="published" value={String(published)} />
          </div>
        </div>
      </section>

      {/* ── Actions ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-6">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2.5 rounded-xl bg-rose-500 px-6 py-6 text-white font-semibold shadow-md shadow-rose-500/25 transition-all duration-200 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30"
        >
          {isPending && <IconLoader2 className="size-4 animate-spin" />}
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={() => router.push("/bureau/evenements")}
          className="rounded-xl px-5 py-6 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
