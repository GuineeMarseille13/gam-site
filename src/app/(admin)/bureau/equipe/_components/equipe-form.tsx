"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconUpload, IconUser, IconX, IconEye, IconEyeOff, IconLoader2, IconAlertCircle, IconKey, IconShieldCheck, IconChevronDown } from "@tabler/icons-react"
import { POSTES } from "./postes"
import { DASHBOARD_ROLES } from "../../membres/_components/roles"

const CLOUD_NAME = "df3ymbrqe"

function buildThumbUrl(imageId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_400,c_fill,q_auto,f_auto/${imageId}`
}

// ── Types ──────────────────────────────────────────────────────────────────────

type ActionResult = { error: string } | { success: true } | undefined

interface EquipeFormProps {
  mode: "create" | "edit"
  createAction?: (formData: FormData) => Promise<ActionResult>
  updateAction?: (formData: FormData) => Promise<ActionResult>
  changePasswordAction?: (newPassword: string) => Promise<{ success: true } | { error: string } | undefined>
  defaultValues?: {
    firstName?:   string
    lastName?:    string
    email?:       string | null
    phone?:       string
    role?:        string | null
    associationRoleCode?: string | null
    description?: string | null
    imageId?:     string | null
    order?:       number
    showOnSite?:  boolean
    /** Présence d'un compte User lié — email readonly en édition */
    userId?:      string | null
  }
}

// ── Composant ──────────────────────────────────────────────────────────────────

export function EquipeForm({ mode, createAction, updateAction, changePasswordAction, defaultValues }: EquipeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [showOnSite, setShowOnSite]     = useState(defaultValues?.showOnSite ?? true)
  const [role, setRole]                 = useState(defaultValues?.role ?? "bureau")
  const [associationRoleCode, setAssociationRoleCode] = useState(
    defaultValues?.associationRoleCode ?? "",
  )
  const [preview, setPreview]           = useState<string | null>(null)
  const [existingId, setExistingId]     = useState(defaultValues?.imageId ?? "")
  const [sizeError, setSizeError]       = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const fileRef    = useRef<HTMLInputElement>(null)
  const MAX_MB     = 10
  const displaySrc = preview ?? (existingId ? buildThumbUrl(existingId) : null)
  const hasUser    = !!defaultValues?.userId

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
    setExistingId("")
  }

  function handleRemove() {
    setPreview(null)
    setExistingId("")
    if (fileRef.current) fileRef.current.value = ""
  }

  // ── Soumission ───────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("role", role)
    formData.set("associationRoleCode", associationRoleCode)
    const action = mode === "create" ? createAction : updateAction

    startTransition(async () => {
      try {
        const result = await action?.(formData)
        if (result && "error" in result) {
          setError(result.error)
          return
        }
        router.push("/bureau/equipe")
        router.refresh()
      } catch {
        setError("Une erreur inattendue s'est produite. Veuillez réessayer.")
      }
    })
  }

  // ── États pour le changement de mot de passe ─────────────────────────────────

  const [pwdOpen, setPwdOpen]         = useState(false)
  const [pwdValue, setPwdValue]       = useState("")
  const [pwdConfirm, setPwdConfirm]   = useState("")
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwdError, setPwdError]       = useState<string | null>(null)
  const [pwdSuccess, setPwdSuccess]   = useState(false)
  const [isPwdPending, startPwdTransition] = useTransition()

  function handlePasswordSubmit() {
    setPwdError(null)
    if (pwdValue.length < 8) { setPwdError("Minimum 8 caractères."); return }
    if (pwdValue !== pwdConfirm) { setPwdError("Les mots de passe ne correspondent pas."); return }
    startPwdTransition(async () => {
      const result = await changePasswordAction?.(pwdValue)
      if (result && "error" in result) { setPwdError(result.error); return }
      setPwdSuccess(true)
      setPwdValue(""); setPwdConfirm("")
    })
  }

  function resetPwdFields() {
    setPwdValue(""); setPwdConfirm("")
    setPwdError(null); setPwdSuccess(false)
    setShowPwd(false); setShowConfirm(false)
  }

  function resetPwd() {
    setPwdOpen(false)
    resetPwdFields()
  }

  // ── Rendu ────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">

        {/* ── Colonne image ──────────────────────────────────────── */}
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
                  {showOnSite ? <IconEye className="size-3.5" /> : <IconEyeOff className="size-3.5" />}
                </div>
                <p className="text-xs font-medium leading-tight">
                  {showOnSite ? "Visible sur le site" : "Masqué du site"}
                </p>
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

          {/* Identité : Prénom + Nom */}
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

          {/* Contact : Email + Téléphone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Email {mode === "create" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="email" name="email" type="email"
                defaultValue={defaultValues?.email ?? ""}
                placeholder="jean@gam.fr"
                required={mode === "create"}
                readOnly={mode === "edit" && hasUser}
                className={`h-10 rounded-xl ${mode === "edit" && hasUser ? "cursor-not-allowed bg-muted/50 text-muted-foreground" : ""}`}
              />
              {mode === "edit" && hasUser && (
                <p className="text-[11px] text-muted-foreground/70">
                  Lié au compte dashboard.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Téléphone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone" name="phone" required
                defaultValue={defaultValues?.phone ?? ""}
                placeholder="+33 6 00 00 00 00"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Mot de passe — création uniquement */}
          {mode === "create" && (
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Mot de passe <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 caractères"
                  minLength={8}
                  required
                  className="h-10 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Accès : Rôle + Poste */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Rôle <span className="text-destructive">*</span>
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Sélectionner un rôle…">
                    {DASHBOARD_ROLES.find((r) => r.value === role)?.label ?? "Sélectionner un rôle…"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1.5 shadow-lg w-[var(--radix-select-trigger-width)]">
                  {DASHBOARD_ROLES.map((r) => (
                    <SelectItem
                      key={r.value}
                      value={r.value}
                      className="rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:bg-amber-50 focus:text-amber-900 data-[state=checked]:bg-amber-50 data-[state=checked]:text-amber-900 dark:focus:bg-amber-950/40 dark:focus:text-amber-300 dark:data-[state=checked]:bg-amber-950/40 dark:data-[state=checked]:text-amber-300"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{r.label}</span>
                        <span className="text-[10px] text-muted-foreground">{r.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Rôle dans le bureau <span className="text-destructive">*</span>
              </Label>
              <Select value={associationRoleCode} onValueChange={setAssociationRoleCode}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Sélectionner un rôle…" />
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
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
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

          {/* Affichage : Ordre */}
          <div className="space-y-1.5">
            <Label htmlFor="order" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Ordre d&apos;affichage
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="order" name="order" type="number" min="0"
                defaultValue={defaultValues?.order ?? 0}
                className="h-10 w-24 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Les membres sont triés du plus petit au plus grand.
              </p>
            </div>
          </div>

          {/* ── Sécurité (edit + compte lié) ─────────────────────────── */}
          {mode === "edit" && changePasswordAction && (
            <div className="rounded-2xl border bg-card overflow-hidden">

              {/* En-tête cliquable */}
              <button
                type="button"
                onClick={() => { if (pwdOpen) resetPwdFields(); setPwdOpen((v) => !v) }}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/30 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <IconKey className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sécurité du compte</p>
                    <p className="text-xs text-muted-foreground">Modifier le mot de passe · Révoque toutes les sessions</p>
                  </div>
                </div>
                <IconChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${pwdOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Contenu dépliable */}
              {pwdOpen && (
                <div className="border-t bg-muted/10 px-4 py-4">
                  {pwdSuccess ? (
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
                      <IconShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Mot de passe modifié</p>
                        <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Sessions révoquées · reconnexion requise</p>
                      </div>
                      <button type="button" onClick={resetPwd} className="ml-auto shrink-0 text-xs text-emerald-700 hover:underline cursor-pointer dark:text-emerald-400">
                        Fermer
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Erreur */}
                      {pwdError && (
                        <div className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-rose-200/60 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
                          <IconAlertCircle className="size-3.5 shrink-0" />
                          {pwdError}
                        </div>
                      )}

                      {/* Nouveau mot de passe */}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            type={showPwd ? "text" : "password"}
                            value={pwdValue}
                            onChange={(e) => setPwdValue(e.target.value)}
                            placeholder="Min. 8 caractères"
                            className="h-10 rounded-xl pr-10"
                            autoComplete="new-password"
                          />
                          <button type="button" tabIndex={-1} onClick={() => setShowPwd((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                            {showPwd ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirmer */}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Confirmer
                        </Label>
                        <div className="relative">
                          <Input
                            type={showConfirm ? "text" : "password"}
                            value={pwdConfirm}
                            onChange={(e) => setPwdConfirm(e.target.value)}
                            placeholder="Répéter le mot de passe"
                            className="h-10 rounded-xl pr-10"
                            autoComplete="new-password"
                          />
                          <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                            {showConfirm ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                          </button>
                        </div>
                        {pwdConfirm.length > 0 && (
                          <p className={`text-[11px] font-medium ${pwdValue === pwdConfirm ? "text-emerald-600" : "text-rose-500"}`}>
                            {pwdValue === pwdConfirm ? "✓ Correspondent" : "✗ Ne correspondent pas"}
                          </p>
                        )}
                      </div>

                      {/* Bouton */}
                      <div className="sm:col-span-2 flex justify-end">
                        <Button
                          type="button"
                          onClick={handlePasswordSubmit}
                          disabled={isPwdPending || !pwdValue || !pwdConfirm}
                          className="cursor-pointer gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm shadow-amber-500/20"
                        >
                          {isPwdPending
                            ? <><IconLoader2 className="size-4 animate-spin" />Modification…</>
                            : <><IconKey className="size-4" />Modifier le mot de passe</>
                          }
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 border-t pt-5">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-sm shadow-rose-500/20"
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              {mode === "create" ? "Créer le membre" : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/bureau/equipe")}
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

