"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AvatarUpload } from "@/components/bureau/avatar-upload"
import {
  IconAlertCircle,
  IconCamera,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconUserCircle,
} from "@tabler/icons-react"
import type { CreateAdministrationAccountResult } from "../_actions/create-administration-account"

interface AdministrationCreateAccountFormProps {
  action: (formData: FormData) => Promise<CreateAdministrationAccountResult>
}

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  const v = fieldErrors?.[key]
  return v?.[0]
}

function SectionTitle({
  kicker,
  title,
  description,
  icon: Icon,
}: {
  kicker: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80">
        {kicker}
      </p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5 text-sky-600 dark:text-sky-400" aria-hidden />}
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      {description && <p className="text-sm text-muted-foreground max-w-xl">{description}</p>}
    </div>
  )
}

/**
 * Formulaire : compte Better Auth (rôle administration) + Person liée.
 */
export function AdministrationCreateAccountForm({
  action,
}: AdministrationCreateAccountFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>()
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      setFieldErrors(undefined)

      const form = e.currentTarget
      const formData = new FormData(form)

      startTransition(async () => {
        const result = await action(formData)
        if (result.success) {
          router.push("/administration/acces")
          router.refresh()
          return
        }
        setError(result.error)
        if ("fieldErrors" in result && result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
        }
      })
    },
    [action, router],
  )

  return (
    <Card className="max-w-2xl overflow-hidden border-border/50 bg-card shadow-xl shadow-sky-950/[0.04] ring-1 ring-border/30 dark:shadow-black/30">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {error && (
            <div className="border-b border-rose-200/60 bg-rose-50/90 px-5 py-4 dark:border-rose-900/40 dark:bg-rose-950/35">
              <div className="flex items-start gap-2.5 text-sm text-rose-800 dark:text-rose-200">
                <IconAlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            </div>
          )}

          {/* ── Photo de profil (hero) ───────────────────────────────────────── */}
          <div className="relative border-b border-sky-200/35 bg-gradient-to-br from-sky-50/95 via-background to-background px-5 py-9 sm:px-8 sm:py-11 dark:border-sky-900/35 dark:from-sky-950/45 dark:via-background dark:to-background">
            <div
              className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-45"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 100% 80% at 18% 0%, rgba(56, 189, 248, 0.14), transparent 52%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(14, 165, 233, 0.08), transparent 45%)",
              }}
            />
            <div className="relative mx-auto flex max-w-xl flex-col items-center gap-8 lg:max-w-none lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="flex w-full flex-col gap-4 text-center lg:max-w-md lg:text-left">
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center lg:items-center lg:justify-start lg:gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                    <IconCamera className="size-[1.15rem]" aria-hidden />
                  </span>
                  <h2 className="text-pretty text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
                    Photo de profil
                  </h2>
                </div>
                <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center lg:items-center lg:justify-start">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground lg:justify-start">
                    <span className="rounded-full border border-border/50 bg-background/70 px-3 py-1 font-medium text-foreground/85 shadow-sm backdrop-blur-sm dark:bg-background/40">
                      JPG · PNG · WebP
                    </span>
                    <span className="text-muted-foreground/70" aria-hidden>
                      ·
                    </span>
                    <span className="font-medium tabular-nums text-foreground/75">10 Mo max</span>
                  </div>
                  <p className="text-center text-[11px] text-muted-foreground/85 lg:text-left">
                    Glisser-déposer ou cliquer sur le cercle
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <div
                  className="
                    rounded-[1.35rem] border border-sky-200/55 bg-background/75 p-5 shadow-sm
                    ring-1 ring-sky-500/[0.07] backdrop-blur-[2px]
                    dark:border-sky-800/55 dark:bg-sky-950/25 dark:ring-sky-400/[0.08]
                  "
                >
                  <AvatarUpload
                    hideSideText
                    sizeClass="size-[9.25rem] sm:size-40"
                    dragActiveClassName="ring-sky-500 ring-offset-2 ring-offset-background scale-[1.02] shadow-lg shadow-sky-500/25"
                    placeholderClass="from-sky-100 via-sky-50 to-sky-200 text-sky-600 dark:from-sky-950/80 dark:via-sky-900/50 dark:to-sky-950 dark:text-sky-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-5 py-8 sm:px-8">
            <section className="space-y-4">
              <SectionTitle
                kicker="Identité"
                title="Coordonnées"
                description="Informations de la personne et email utilisé pour la connexion."
                icon={IconUserCircle}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Prénom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className="h-11 rounded-xl border-border/60 bg-background/80 shadow-sm transition-shadow focus-visible:ring-sky-500/30"
                    aria-invalid={!!fieldError(fieldErrors, "firstName")}
                  />
                  {fieldError(fieldErrors, "firstName") && (
                    <p className="text-xs text-destructive">{fieldError(fieldErrors, "firstName")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Nom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    className="h-11 rounded-xl border-border/60 bg-background/80 shadow-sm transition-shadow focus-visible:ring-sky-500/30"
                    aria-invalid={!!fieldError(fieldErrors, "lastName")}
                  />
                  {fieldError(fieldErrors, "lastName") && (
                    <p className="text-xs text-destructive">{fieldError(fieldErrors, "lastName")}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email (connexion) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="h-11 rounded-xl border-border/60 bg-background/80 shadow-sm transition-shadow focus-visible:ring-sky-500/30"
                  aria-invalid={!!fieldError(fieldErrors, "email")}
                />
                {fieldError(fieldErrors, "email") && (
                  <p className="text-xs text-destructive">{fieldError(fieldErrors, "email")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Téléphone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+33 6 12 34 56 78"
                  className="h-11 rounded-xl border-border/60 bg-background/80 shadow-sm transition-shadow focus-visible:ring-sky-500/30"
                  aria-invalid={!!fieldError(fieldErrors, "phone")}
                />
                {fieldError(fieldErrors, "phone") && (
                  <p className="text-xs text-destructive">{fieldError(fieldErrors, "phone")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Note / description{" "}
                  <span className="font-normal text-muted-foreground">(optionnel)</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Courte mention interne…"
                  className="min-h-[88px] resize-y rounded-xl border-border/60 bg-background/80 shadow-sm transition-shadow focus-visible:ring-sky-500/30"
                />
                {fieldError(fieldErrors, "description") && (
                  <p className="text-xs text-destructive">{fieldError(fieldErrors, "description")}</p>
                )}
              </div>
            </section>

            <Separator className="bg-border/60" />

            <section className="space-y-4">
              <SectionTitle
                kicker="Sécurité"
                title="Mot de passe du compte"
                description="Minimum 8 caractères. Le collaborateur pourra le modifier depuis son profil."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      className="h-11 rounded-xl border-border/60 bg-background/80 pr-10 shadow-sm focus-visible:ring-sky-500/30"
                      aria-invalid={!!fieldError(fieldErrors, "password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                      aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPwd ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                    </button>
                  </div>
                  {fieldError(fieldErrors, "password") && (
                    <p className="text-xs text-destructive">{fieldError(fieldErrors, "password")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmer <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPwd2 ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      className="h-11 rounded-xl border-border/60 bg-background/80 pr-10 shadow-sm focus-visible:ring-sky-500/30"
                      aria-invalid={!!fieldError(fieldErrors, "confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd2((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                      aria-label={showPwd2 ? "Masquer" : "Afficher"}
                    >
                      {showPwd2 ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                    </button>
                  </div>
                  {fieldError(fieldErrors, "confirmPassword") && (
                    <p className="text-xs text-destructive">{fieldError(fieldErrors, "confirmPassword")}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[160px] rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20 transition-all hover:bg-sky-700 hover:shadow-lg"
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  "Créer le compte"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-border/60"
                disabled={isPending}
                onClick={() => router.push("/administration/acces")}
              >
                Annuler
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
