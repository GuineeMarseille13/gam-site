"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  IconCamera,
  IconX,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconAlertCircle,
  IconKey,
  IconShieldCheck,
  IconChevronDown,
  IconCircleFilled,
  IconBriefcase,
} from "@tabler/icons-react"
import { getPosteLabel } from "../../equipe/_components/postes"

// ── Styles ─────────────────────────────────────────────────────────────────────

const ROLE_BADGE: Record<string, { label: string; dot: string; badge: string }> = {
  admin:          { label: "Administrateur", dot: "text-amber-500", badge: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40" },
  bureau:         { label: "Bureau",         dot: "text-blue-500",  badge: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40" },
  administration: { label: "Administration", dot: "text-sky-500",  badge: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-800/40" },
}

// ── Types ──────────────────────────────────────────────────────────────────────

type ActionResult = { error: string } | { success: true } | undefined

interface ProfilFormProps {
  defaultValues: {
    firstName: string
    lastName:  string
    email:     string
    phone:     string
    role?:     string | null
    poste?:    string | null
    image?:    string | null
  }
  updateAction:         (formData: FormData) => Promise<ActionResult>
  changePasswordAction: (currentPassword: string, newPassword: string) => Promise<ActionResult>
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

// ── Composant ──────────────────────────────────────────────────────────────────

export function ProfilForm({ defaultValues, updateAction, changePasswordAction }: ProfilFormProps) {
  const router = useRouter()

  // ── Soumission principale
  const [isPending, startTransition] = useTransition()
  const [error, setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // ── Image
  const fileRef    = useRef<HTMLInputElement>(null)
  const MAX_MB     = 10
  const [preview, setPreview]       = useState<string | null>(null)
  const [removedImg, setRemovedImg] = useState(false)
  const [sizeError, setSizeError]   = useState<string | null>(null)

  const displaySrc = removedImg ? null : preview ?? defaultValues.image ?? null

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) {
      setSizeError(`Fichier trop volumineux. Max ${MAX_MB} Mo.`)
      e.target.value = ""
      return
    }
    setSizeError(null)
    setPreview(URL.createObjectURL(file))
    setRemovedImg(false)
  }

  function handleRemoveImage() {
    setPreview(null)
    setRemovedImg(true)
    if (fileRef.current) fileRef.current.value = ""
  }

  // ── Mot de passe
  const [pwdOpen, setPwdOpen]               = useState(false)
  const [currentPwd, setCurrentPwd]         = useState("")
  const [pwdValue, setPwdValue]             = useState("")
  const [pwdConfirm, setPwdConfirm]         = useState("")
  const [showCurrentPwd, setShowCurrentPwd] = useState(false)
  const [showPwd, setShowPwd]               = useState(false)
  const [showConfirm, setShowConfirm]       = useState(false)
  const [pwdError, setPwdError]             = useState<string | null>(null)
  const [pwdSuccess, setPwdSuccess]         = useState(false)
  const [isPwdPending, startPwdTransition]  = useTransition()

  function resetPwdFields() {
    setCurrentPwd(""); setPwdValue(""); setPwdConfirm("")
    setPwdError(null); setPwdSuccess(false)
    setShowCurrentPwd(false); setShowPwd(false); setShowConfirm(false)
  }

  function handlePasswordSubmit() {
    setPwdError(null)
    if (!currentPwd)          { setPwdError("Veuillez saisir votre mot de passe actuel."); return }
    if (pwdValue.length < 8)  { setPwdError("Minimum 8 caractères."); return }
    if (pwdValue !== pwdConfirm) { setPwdError("Les mots de passe ne correspondent pas."); return }
    startPwdTransition(async () => {
      const result = await changePasswordAction(currentPwd, pwdValue)
      if (result && "error" in result) { setPwdError(result.error); return }
      setPwdSuccess(true)
      setCurrentPwd(""); setPwdValue(""); setPwdConfirm("")
    })
  }

  // ── Soumission formulaire principal
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    if (removedImg) formData.set("removeImage", "true")
    startTransition(async () => {
      try {
        const result = await updateAction(formData)
        if (result && "error" in result) { setError(result.error); return }
        setSuccess(true)
        router.refresh()
      } catch {
        setError("Une erreur inattendue s'est produite.")
      }
    })
  }

  const roleInfo   = ROLE_BADGE[defaultValues.role ?? ""]
  const posteLabel = getPosteLabel(defaultValues.poste ?? null)

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">

        {/* ── Colonne gauche : avatar + infos statiques ───────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-4">

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

            {sizeError && (
              <p className="text-xs text-destructive">{sizeError}</p>
            )}

            {/* Avatar cliquable */}
            <div className="relative mx-auto w-fit">
              <Avatar className="size-36 ring-4 ring-border/30 shadow-lg">
                <AvatarImage src={displaySrc ?? ""} alt="Photo de profil" className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300">
                  {initials(defaultValues.firstName, defaultValues.lastName)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-1 right-1 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md ring-2 ring-border/40 transition hover:bg-muted dark:bg-zinc-800"
                title="Changer la photo"
              >
                <IconCamera className="size-4 text-foreground" />
              </button>
            </div>

            {displaySrc && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mx-auto flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                <IconX className="size-3.5" />
                Supprimer la photo
              </button>
            )}

            <p className="text-center text-[11px] text-muted-foreground">
              Format recommandé&nbsp;: carré · min. 400&times;400&nbsp;px · max&nbsp;{MAX_MB}&nbsp;Mo
            </p>

            {/* Rôle + Poste (lecture seule) */}
            {(roleInfo || posteLabel) && (
              <div className="space-y-2.5 rounded-2xl border bg-muted/20 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Rôle &amp; poste
                </p>
                {roleInfo && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleInfo.badge}`}>
                    <IconCircleFilled className={`size-1.5 ${roleInfo.dot}`} />
                    {roleInfo.label}
                  </span>
                )}
                {posteLabel && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40">
                      <IconBriefcase className="size-3 shrink-0" />
                      {posteLabel}
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground/60">
                  Modifiable uniquement par un administrateur.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Colonne droite : formulaire ─────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">

          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
              <IconAlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
              <IconShieldCheck className="size-4 shrink-0" />
              Profil mis à jour avec succès.
            </div>
          )}

          {/* Identité */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName" name="firstName" required autoFocus
                defaultValue={defaultValues.firstName}
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
                defaultValue={defaultValues.lastName}
                placeholder="Dupont"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Email + Téléphone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={defaultValues.email}
                readOnly
                className="h-10 cursor-not-allowed rounded-xl bg-muted/50 text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground/70">
                Non modifiable via cette interface.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Téléphone
              </Label>
              <Input
                id="phone" name="phone"
                defaultValue={defaultValues.phone}
                placeholder="+33 6 00 00 00 00"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* ── Sécurité : accordion mot de passe ────────────────── */}
          <div className="overflow-hidden rounded-2xl border bg-card">

            {/* En-tête cliquable */}
            <button
              type="button"
              onClick={() => { if (pwdOpen) resetPwdFields(); setPwdOpen((v) => !v) }}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <IconKey className="size-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Changer le mot de passe</p>
                  <p className="text-xs text-muted-foreground">Révoque toutes les autres sessions actives</p>
                </div>
              </div>
              <IconChevronDown
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${pwdOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Contenu dépliable */}
            {pwdOpen && (
              <div className="border-t bg-muted/10 px-4 py-4">
                {pwdSuccess ? (
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
                    <IconShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Mot de passe modifié</p>
                      <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Autres sessions révoquées</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { resetPwdFields(); setPwdOpen(false) }}
                      className="ml-auto shrink-0 cursor-pointer text-xs text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {pwdError && (
                      <div className="flex items-center gap-2 rounded-xl border border-rose-200/60 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
                        <IconAlertCircle className="size-3.5 shrink-0" />
                        {pwdError}
                      </div>
                    )}

                    {/* Mot de passe actuel */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Mot de passe actuel
                      </Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPwd ? "text" : "password"}
                          value={currentPwd}
                          onChange={(e) => setCurrentPwd(e.target.value)}
                          placeholder="Votre mot de passe actuel"
                          className="h-10 rounded-xl pr-10"
                          autoComplete="current-password"
                        />
                        <button
                          type="button" tabIndex={-1}
                          onClick={() => setShowCurrentPwd((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showCurrentPwd ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Nouveau + Confirmer */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                          <button
                            type="button" tabIndex={-1}
                            onClick={() => setShowPwd((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {showPwd ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                          </button>
                        </div>
                      </div>

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
                          <button
                            type="button" tabIndex={-1}
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {showConfirm ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                          </button>
                        </div>
                        {pwdConfirm.length > 0 && (
                          <p className={`text-[11px] font-medium ${pwdValue === pwdConfirm ? "text-emerald-600" : "text-rose-500"}`}>
                            {pwdValue === pwdConfirm ? "✓ Correspondent" : "✗ Ne correspondent pas"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={handlePasswordSubmit}
                        disabled={isPwdPending || !currentPwd || !pwdValue || !pwdConfirm}
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

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 border-t pt-5">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-sm shadow-rose-500/20"
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/bureau/")}
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
