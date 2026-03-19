"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubmitButton } from "@/components/bureau/submit-button"
import { IconUpload, IconUser, IconX, IconEye, IconEyeOff } from "@tabler/icons-react"
import { POSTES } from "./postes"

const CLOUD_NAME = "df3ymbrqe"

function buildThumbUrl(imageId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_400,c_fill,q_auto,f_auto/${imageId}`
}

interface EquipeFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    firstName?: string
    lastName?: string
    email?: string | null
    phone?: string
    poste?: string | null
    description?: string | null
    imageId?: string | null
    order?: number
    showOnSite?: boolean
  }
}

export function EquipeForm({ action, defaultValues }: EquipeFormProps) {
  const [showOnSite, setShowOnSite] = useState(defaultValues?.showOnSite ?? true)
  const [poste, setPoste] = useState(defaultValues?.poste ?? "")
  const [preview, setPreview] = useState<string | null>(null)
  const [existingId, setExistingId] = useState(defaultValues?.imageId ?? "")
  const [sizeError, setSizeError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const MAX_MB = 10
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
    <form action={action} className="max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">

        {/* ── Colonne image ─────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Photo du membre
            </p>

            <input ref={fileRef} type="file" name="imageFile" accept="image/*" className="hidden" onChange={handleFile} />
            <input type="hidden" name="imageId" value={existingId} />

            {sizeError && <p className="text-xs text-destructive">{sizeError}</p>}

            {displaySrc ? (
              <div className="group relative overflow-hidden rounded-2xl border bg-muted shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displaySrc}
                  alt="Aperçu"
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-gray-900 shadow backdrop-blur-sm transition hover:bg-white"
                  >
                    <IconUpload className="size-3.5" />
                    Changer la photo
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
                className="group flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/60"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl border border-dashed border-current opacity-40 transition-opacity group-hover:opacity-70">
                  <IconUser className="size-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Cliquer pour choisir</p>
                  <p className="mt-0.5 text-xs opacity-60">JPG, PNG, WebP — max {MAX_MB} Mo</p>
                </div>
              </button>
            )}

            <p className="text-[11px] text-muted-foreground">
              Format recommandé&nbsp;: carré · min. 400 × 400 px
            </p>

            {/* Visibilité sur le site */}
            <div
              className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                showOnSite
                  ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                  : "border-border bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                  showOnSite
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {showOnSite ? <IconEye className="size-3.5" /> : <IconEyeOff className="size-3.5" />}
                </div>
                <div>
                  <p className="text-xs font-medium leading-tight">
                    {showOnSite ? "Visible sur le site" : "Masqué du site"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                    Section &quot;Nos bénévoles&quot;
                  </p>
                </div>
              </div>
              <Switch checked={showOnSite} onCheckedChange={setShowOnSite} />
              <input type="hidden" name="showOnSite" value={showOnSite ? "true" : "false"} />
            </div>
          </div>
        </div>

        {/* ── Colonne champs ────────────────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="firstName"
                className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Prénom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName" name="firstName" required
                defaultValue={defaultValues?.firstName ?? ""}
                placeholder="Jean"
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="lastName"
                className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName" name="lastName" required
                defaultValue={defaultValues?.lastName ?? ""}
                placeholder="Dupont"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Poste */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Poste dans le bureau
            </Label>
            <Select value={poste} onValueChange={setPoste}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Sélectionner un poste…" />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1.5 shadow-lg w-[var(--radix-select-trigger-width)]">
                {POSTES.map((p) => (
                  <SelectItem
                    key={p.value}
                    value={p.value}
                    className="rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:bg-rose-50 focus:text-rose-900 data-[state=checked]:bg-rose-50 data-[state=checked]:text-rose-900 dark:focus:bg-rose-950/40 dark:focus:text-rose-300 dark:data-[state=checked]:bg-rose-950/40 dark:data-[state=checked]:text-rose-300"
                  >
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {poste && (
              <button
                type="button"
                onClick={() => setPoste("")}
                className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
              >
                Retirer le poste
              </button>
            )}
            <input type="hidden" name="poste" value={poste} />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email" name="email" type="email"
              defaultValue={defaultValues?.email ?? ""}
              placeholder="jean@gam.fr"
              className="h-10 rounded-xl"
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Téléphone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone" name="phone" required
              defaultValue={defaultValues?.phone ?? ""}
              placeholder="+33 6 00 00 00 00"
              className="h-10 rounded-xl"
            />
          </div>

          {/* Description / Rôle */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Description / Rôle
            </Label>
            <Textarea
              id="description" name="description"
              rows={3}
              defaultValue={defaultValues?.description ?? ""}
              placeholder="Rôle dans l'équipe, description…"
              className="resize-none rounded-xl"
            />
          </div>

          {/* Ordre d'affichage */}
          <div className="space-y-1.5">
            <Label
              htmlFor="order"
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Ordre d&apos;affichage
            </Label>
            <Input
              id="order" name="order" type="number" min="0"
              defaultValue={defaultValues?.order ?? 0}
              className="h-10 w-32 rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t pt-5">
            <SubmitButton>Enregistrer</SubmitButton>
            <Button variant="ghost" asChild>
              <Link href="/bureau/equipe">Annuler</Link>
            </Button>
          </div>

        </div>
      </div>
    </form>
  )
}
