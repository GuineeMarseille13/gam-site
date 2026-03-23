"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  IconUpload, IconUser, IconX, IconEye, IconEyeOff,
  IconLoader2, IconAlertCircle, IconMapPin,
} from "@tabler/icons-react"
import { createBenevole, updateBenevole } from "../_actions/actions"

// ── Types ──────────────────────────────────────────────────────────────────────

type ActionResult = { error: string } | { success: true } | undefined

interface BenevoleFormProps {
  mode: "create" | "edit"
  defaultValues?: {
    id:          string
    firstName:   string
    lastName:    string
    phone:       string
    email?:      string | null
    imageUrl?:   string | null
    showOnSite?: boolean
    address?: {
      address: string
      zipCode: string
      city:    string
      country: string
    } | null
  }
}

// ── Composant ──────────────────────────────────────────────────────────────────

export function BenevoleForm({ mode, defaultValues }: BenevoleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [showOnSite, setShowOnSite] = useState(defaultValues?.showOnSite ?? true)
  const [preview, setPreview]       = useState<string | null>(defaultValues?.imageUrl ?? null)
  const [removed, setRemoved]       = useState(false)   // image supprimée en édition
  const [sizeError, setSizeError]   = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const MAX_MB  = 10

  // ── Handlers image ───────────────────────────────────────────────────────────

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
    setRemoved(false)
  }

  function handleRemove() {
    setPreview(null)
    setRemoved(true)
    if (fileRef.current) fileRef.current.value = ""
  }

  // ── Soumission ───────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      let result: ActionResult
      if (mode === "create") {
        result = await createBenevole(formData)
      } else {
        result = await updateBenevole(defaultValues!.id, formData)
      }

      if (result && "error" in result) {
        setError(result.error)
        return
      }

      router.push("/bureau/membres")
      router.refresh()
    })
  }

  // ── Rendu ────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">

        {/* ── Colonne image ──────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Photo de profil
            </p>

            <input
              ref={fileRef}
              type="file"
              name="imageFile"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            {/* Signal de suppression d'image existante */}
            <input type="hidden" name="removeImage" value={removed ? "true" : "false"} />

            {sizeError && <p className="text-xs text-destructive">{sizeError}</p>}

            {preview ? (
              <div className="group relative overflow-hidden rounded-2xl border bg-muted shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
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
            <p className="text-[11px] text-amber-600/80 dark:text-amber-500/70">
              Une photo est requise pour apparaître sur le site.
            </p>

            {/* Visibilité sur le site */}
            <div className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
              showOnSite
                ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                : "border-border bg-muted/20"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                  showOnSite
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {showOnSite
                    ? <IconEye className="size-3.5" />
                    : <IconEyeOff className="size-3.5" />}
                </div>
                <div>
                  <p className="text-xs font-medium leading-tight">
                    {showOnSite ? "Visible sur le site" : "Masqué du site"}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 leading-tight mt-0.5">
                    Section &ldquo;Nos bénévoles&rdquo;
                  </p>
                </div>
              </div>
              <Switch checked={showOnSite} onCheckedChange={setShowOnSite} />
              <input type="hidden" name="showOnSite" value={showOnSite ? "true" : "false"} />
            </div>
          </div>
        </div>

        {/* ── Colonne champs ─────────────────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">

          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
              <IconAlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName" name="firstName" required autoFocus
                defaultValue={defaultValues?.firstName ?? ""}
                placeholder="Jean"
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
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

          {/* Téléphone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Téléphone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone" name="phone" type="tel" required
              defaultValue={defaultValues?.phone ?? ""}
              placeholder="+33 6 12 34 56 78"
              className="h-10 rounded-xl"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Email{" "}
              <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
            </Label>
            <Input
              id="email" name="email" type="email"
              defaultValue={defaultValues?.email ?? ""}
              placeholder="jean@exemple.fr"
              className="h-10 rounded-xl"
            />
          </div>

          {/* ── Section adresse ──────────────────────────────────── */}
          <div className="flex items-center gap-3 pt-1">
            <div className="h-px flex-1 bg-border" />
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <IconMapPin className="size-3.5" />
              Adresse{" "}
              <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Rue */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Rue
            </Label>
            <Input
              id="address" name="address"
              defaultValue={defaultValues?.address?.address ?? ""}
              placeholder="12 rue de la Paix"
              className="h-10 rounded-xl"
            />
          </div>

          {/* Code postal + Ville */}
          <div className="grid grid-cols-[2fr_3fr] gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="zipCode" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Code postal
              </Label>
              <Input
                id="zipCode" name="zipCode"
                defaultValue={defaultValues?.address?.zipCode ?? ""}
                placeholder="75001"
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Ville
              </Label>
              <Input
                id="city" name="city"
                defaultValue={defaultValues?.address?.city ?? ""}
                placeholder="Paris"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Pays */}
          <div className="space-y-1.5">
            <Label htmlFor="country" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Pays
            </Label>
            <Input
              id="country" name="country"
              defaultValue={defaultValues?.address?.country ?? "France"}
              placeholder="France"
              className="h-10 rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 border-t pt-5">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm shadow-violet-500/20"
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              {mode === "create" ? "Ajouter le bénévole" : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/bureau/membres")}
              disabled={isPending}
              className="cursor-pointer rounded-xl text-muted-foreground hover:text-foreground"
            >
              Annuler
            </Button>
          </div>

        </div>
      </div>
    </form>
  )
}
