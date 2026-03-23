"use client"

import { useRef, useState, useTransition } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  IconPhoto, IconUpload, IconX, IconEye, IconEyeOff,
  IconFileDescription, IconPresentationAnalytics, IconPlus, IconTrash, IconLoader2,
} from "@tabler/icons-react"
import type { ActionState } from "../_actions/actions"

const CLOUD_NAME = "df3ymbrqe"
const MAX_MB = 10

function buildUrl(id: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_600,h_400,c_fill,q_auto,f_auto/${id}`
}

type PopupType = "IMAGE_TEXT" | "PROSPECTUS"

export interface PopupFormDefaults {
  type?: PopupType
  isActive?: boolean
  badge?: string | null
  title?: string | null
  subtitle?: string | null
  description?: string | null
  date?: string | null
  location?: string | null
  imageId?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  prospectusIds?: string[]
}

interface PopupFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: PopupFormDefaults
  cancelHref?: string
}

// ── Composant ─────────────────────────────────────────────────────────────────

export function PopupForm({ action, defaultValues, cancelHref = "/bureau/popup" }: PopupFormProps) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<PopupType>(defaultValues?.type ?? "IMAGE_TEXT")
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? false)

  // IMAGE_TEXT image
  const imgFileRef = useRef<HTMLInputElement>(null)
  const [imgPreview, setImgPreview]     = useState<string | null>(null)
  const [imgExisting, setImgExisting]   = useState(defaultValues?.imageId ?? "")
  const [imgFile,    setImgFile]        = useState<File | null>(null)

  // PROSPECTUS images
  const proFileRef = useRef<HTMLInputElement>(null)
  const [keptIds,    setKeptIds]        = useState<string[]>(defaultValues?.prospectusIds ?? [])
  const [newFiles,   setNewFiles]       = useState<{ file: File; preview: string }[]>([])
  const [proError,   setProError]       = useState<string | null>(null)

  // ── Handlers image principale ──
  function handleImgFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image trop volumineuse (max ${MAX_MB} Mo)`)
      e.target.value = ""
      return
    }
    setImgPreview(URL.createObjectURL(file))
    setImgExisting("")
    setImgFile(file)
  }
  function removeImg() { setImgPreview(null); setImgExisting(""); setImgFile(null); if (imgFileRef.current) imgFileRef.current.value = "" }

  // ── Handlers prospectus ──
  function handleProFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const big = files.find((f) => f.size > MAX_MB * 1024 * 1024)
    if (big) { setProError(`"${big.name}" dépasse ${MAX_MB} Mo`); return }
    setProError(null)
    setNewFiles((prev) => [...prev, ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))])
    e.target.value = ""
  }

  // ── Submit ──
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    // Inject image file for IMAGE_TEXT
    if (type === "IMAGE_TEXT" && imgFile) fd.set("imageFile", imgFile)

    // Inject prospectus files
    newFiles.forEach(({ file }) => fd.append("prospectusFile", file))

    // Inject kept prospectus IDs
    fd.delete("existingProspectusId")
    keptIds.forEach((id) => fd.append("existingProspectusId", id))

    startTransition(async () => {
      const result = await action(null, fd)
      if (result?.error) setError(result.error)
    })
  }

  const imgSrc = imgPreview ?? (imgExisting ? buildUrl(imgExisting) : null)
  const totalPro = keptIds.length + newFiles.length

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>}

      {/* ── Type selector ── */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Type d&apos;annonce</Label>
        <input type="hidden" name="type" value={type} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {([
            { value: "IMAGE_TEXT" as const, icon: IconFileDescription, label: "Image + texte", sub: "Image avec titre, description et lien" },
            { value: "PROSPECTUS" as const, icon: IconPresentationAnalytics, label: "Prospectus / Flyer", sub: "Une ou plusieurs affiches" },
          ]).map(({ value, icon: Icon, label, sub }) => (
            <button key={value} type="button" onClick={() => setType(value)}
              className={`cursor-pointer flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                type === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
              }`}>
              <Icon className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-0.5 text-xs opacity-70">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── IMAGE_TEXT ── */}
      {type === "IMAGE_TEXT" && (
        <div className="grid gap-6 md:grid-cols-5">

          {/* Image */}
          <div className="md:col-span-2">
            <div className="sticky top-6 space-y-2">
              <p className="text-sm font-medium">Image principale</p>
              <input ref={imgFileRef} type="file" accept="image/*" className="hidden" onChange={handleImgFile} />

              {imgSrc ? (
                <div className="group relative overflow-hidden rounded-2xl border bg-muted shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt="Aperçu"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                    <button type="button" onClick={() => imgFileRef.current?.click()}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-gray-900 shadow backdrop-blur-sm transition hover:bg-white">
                      <IconUpload className="size-3.5" /> Changer l&apos;image
                    </button>
                    <button type="button" onClick={removeImg}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/80">
                      <IconX className="size-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => imgFileRef.current?.click()}
                  className="cursor-pointer group flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/60">
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

          {/* Champs texte */}
          <div className="space-y-3 md:col-span-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="badge" className="text-xs text-muted-foreground">Badge</Label>
                <Input id="badge" name="badge" defaultValue={defaultValues?.badge ?? ""} placeholder="Ex : Prochainement" className="h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="date" className="text-xs text-muted-foreground">Date affichée</Label>
                <Input id="date" name="date" defaultValue={defaultValues?.date ?? ""} placeholder="Ex : Samedi 15 Juin" className="h-9" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs text-muted-foreground">Titre</Label>
              <Input id="title" name="title" defaultValue={defaultValues?.title ?? ""} placeholder="Ex : Soirée Culturelle" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="subtitle" className="text-xs text-muted-foreground">Sous-titre</Label>
              <Input id="subtitle" name="subtitle" defaultValue={defaultValues?.subtitle ?? ""} placeholder="Ex : Une nuit de partage" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location" className="text-xs text-muted-foreground">Lieu</Label>
              <Input id="location" name="location" defaultValue={defaultValues?.location ?? ""} placeholder="Ex : Marseille — Salle des Fêtes" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs text-muted-foreground">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description ?? ""} placeholder="Décrivez l'événement…" className="resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="ctaLabel" className="text-xs text-muted-foreground">Texte du bouton</Label>
                <Input id="ctaLabel" name="ctaLabel" defaultValue={defaultValues?.ctaLabel ?? "En savoir plus"} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ctaUrl" className="text-xs text-muted-foreground">Lien du bouton</Label>
                <Input id="ctaUrl" name="ctaUrl" defaultValue={defaultValues?.ctaUrl ?? ""} placeholder="/evenements" className="h-9" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROSPECTUS ── */}
      {type === "PROSPECTUS" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Images du prospectus / flyer</p>
            <span className="text-xs text-muted-foreground">{totalPro} image{totalPro !== 1 ? "s" : ""}</span>
          </div>
          {proError && <p className="text-xs text-destructive">{proError}</p>}
          <input ref={proFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleProFiles} />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* Existing */}
            {keptIds.map((id) => (
              <div key={id} className="group relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={buildUrl(id)} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setKeptIds((p) => p.filter((x) => x !== id))}
                  className="cursor-pointer absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500">
                  <IconTrash className="size-3" />
                </button>
              </div>
            ))}
            {/* New */}
            {newFiles.map((p, i) => (
              <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted ring-2 ring-primary/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="h-full w-full object-cover" />
                <div className="absolute left-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-white">Nouveau</div>
                <button type="button" onClick={() => setNewFiles((prev) => prev.filter((_, j) => j !== i))}
                  className="cursor-pointer absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500">
                  <IconTrash className="size-3" />
                </button>
              </div>
            ))}
            {/* Add button */}
            <button type="button" onClick={() => proFileRef.current?.click()}
              className="cursor-pointer flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/60">
              <div className="flex size-9 items-center justify-center rounded-full border border-dashed border-current opacity-50">
                <IconPlus className="size-4" />
              </div>
              <span className="text-xs font-medium">Ajouter</span>
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">Format recommandé : portrait · min. 800 px de large</p>
        </div>
      )}

      {/* ── Visibilité ── */}
      <div className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
        isActive ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-muted/20"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`flex size-9 items-center justify-center rounded-full ${
            isActive ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
          }`}>
            {isActive ? <IconEye className="size-4" /> : <IconEyeOff className="size-4" />}
          </div>
          <div>
            <p className="text-sm font-medium">{isActive ? "Actif — visible sur le site" : "Inactif — masqué"}</p>
            <p className="text-xs text-muted-foreground">
              {isActive ? "S'affiche à chaque visite du site" : "Ce popup ne s'affiche pas"}
            </p>
          </div>
        </div>
        <Switch checked={isActive} onCheckedChange={setIsActive} />
        <input type="hidden" name="isActive" value={String(isActive)} />
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-5">
        <Button type="submit" disabled={pending} className="min-w-36">
          {pending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
          Enregistrer
        </Button>
        <Button variant="ghost" asChild disabled={pending}>
          <Link href={cancelHref}>Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
