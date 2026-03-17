"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Label }    from "@/components/ui/label"
import { Input }    from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button }   from "@/components/ui/button"
import { Switch }   from "@/components/ui/switch"
import { IconPhoto, IconUpload, IconX, IconLoader2, IconTypography, IconAlignLeft, IconSettings2 } from "@tabler/icons-react"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CarouselSlide {
  id:          string
  url:         string
  title:       string | null
  description: string | null
  order:       number | null
  isActive:    boolean
}

interface CarouselFormProps {
  /** Présent en mode édition, absent en création */
  slide?:       CarouselSlide
  action:       (formData: FormData) => Promise<void>
  submitLabel?: string
}

// ── Composant ─────────────────────────────────────────────────────────────────

export function CarouselForm({ slide, action, submitLabel = "Enregistrer" }: CarouselFormProps) {
  const isEdit = !!slide

  const router           = useRouter()
  const [pending, start] = useTransition()
  const fileRef          = useRef<HTMLInputElement>(null)

  const [preview,   setPreview]   = useState<string | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [isActive,  setIsActive]  = useState(slide?.isActive ?? true)

  const MAX_MB    = 10
  const displaySrc = preview ?? slide?.url ?? null

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

  function handleRemove() {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("isActive", isActive ? "on" : "")
    start(() => action(fd))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Zone image ── */}
      <div className="space-y-2">
        <Label>
          Image du slide{!isEdit && <span className="ml-1 text-destructive">*</span>}
        </Label>

        <input ref={fileRef} type="file" name="imageFile" accept="image/*" className="hidden" onChange={handleFile} />

        {sizeError && <p className="text-sm text-destructive">{sizeError}</p>}

        {displaySrc ? (
          <div className="relative w-full overflow-hidden rounded-xl border bg-muted" style={{ aspectRatio: "16/9" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displaySrc} alt="Aperçu" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-end gap-2 p-3">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-black/80 transition-colors">
                <IconUpload className="size-3" /> Changer
              </button>
              <button type="button" onClick={handleRemove}
                className="rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80 transition-colors">
                <IconX className="size-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/70"
            style={{ aspectRatio: "16/9" }}>
            <IconPhoto className="size-9 opacity-40" />
            <div className="text-center">
              <p className="text-sm font-medium">Cliquer pour choisir une image</p>
              <p className="mt-0.5 text-xs opacity-60">JPG, PNG, WebP — max {MAX_MB} Mo</p>
            </div>
          </button>
        )}
      </div>

      {/* ── Texte du slide ── */}
      <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <IconTypography className="size-4 text-muted-foreground" />
          Texte affiché sur le slide
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Titre
          </Label>
          <Input
            id="title" name="title"
            defaultValue={slide?.title ?? ""}
            placeholder="Ex : Nos Événements"
            className="bg-background"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Description
          </Label>
          <Textarea
            id="description" name="description"
            defaultValue={slide?.description ?? ""}
            placeholder="Ex : Participez à nos événements culturels et caritatifs"
            rows={2}
            className="resize-none bg-background"
          />
        </div>

        {/* Aperçu positionnement */}
        <div className="flex items-center gap-2 rounded-lg border border-dashed bg-background px-3 py-2">
          <IconAlignLeft className="size-3.5 shrink-0 text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground">Ces textes s'affichent en bas à gauche de l'image du slide</p>
        </div>
      </div>

      {/* ── Paramètres ── */}
      <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <IconSettings2 className="size-4 text-muted-foreground" />
          Paramètres
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="order" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Position
              </Label>
              <Input
                id="order" name="order" type="number" min={0}
                defaultValue={slide.order ?? 0}
                className="w-20 bg-background"
              />
              <p className="text-xs text-muted-foreground">0 = premier</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            <div>
              <Label htmlFor="isActive" className="cursor-pointer select-none text-sm font-medium">
                {isActive ? "Visible sur le site" : "Masqué"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isActive ? "Ce slide apparaît dans le carousel" : "Ce slide n'est pas affiché"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Boutons ── */}
      <div className="flex flex-wrap gap-3 border-t pt-6">
        <Button type="submit" disabled={pending} className="min-w-36">
          {pending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" disabled={pending}
          onClick={() => router.push("/bureau/carousel")}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
