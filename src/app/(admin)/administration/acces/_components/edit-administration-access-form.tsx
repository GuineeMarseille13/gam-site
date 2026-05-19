"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconAlertCircle, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"
import {
  administrationOutlineButtonClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import { cn } from "@/helpers/utils"
import type { PermanenceAdminRole } from "../_schemas/permanence-admin-role.schema"
import type { AdministrationAccessActionResult } from "../_types/administration-access-action-result"
import {
  ADMINISTRATION_ACCESS_FORM_ICONS,
  AdministrationAccessSectionTitle,
  AdministrationSelectedPersonHero,
  administrationAccessInputClassName,
  administrationAccessSelectContentClassName,
  administrationAccessSelectItemClassName,
  administrationAccessPasswordToggleClassName,
  administrationAccessSelectTriggerClassName,
} from "./administration-access-form-primitives"

interface EditAdministrationAccessFormProps {
  defaultEmail: string
  defaultRole: string
  personLabel: string | null
  profileKind: string | null
  roles: PermanenceAdminRole[]
  action: (formData: FormData) => Promise<AdministrationAccessActionResult>
}

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fieldErrors?.[key]?.[0]
}

function splitPersonName(label: string | null): { firstName?: string; lastName?: string } {
  if (!label) return {}
  const parts = label.trim().split(/\s+/)
  if (parts.length === 0) return {}
  if (parts.length === 1) return { firstName: parts[0] }
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] }
}

/**
 * Modifie le rôle, l’email de connexion et éventuellement le mot de passe d’un accès administration.
 */
export function EditAdministrationAccessForm({
  defaultEmail,
  defaultRole,
  personLabel,
  profileKind,
  roles,
  action,
}: EditAdministrationAccessFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>()
  const [role, setRole] = useState(defaultRole)
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)

  const { firstName, lastName } = splitPersonName(personLabel)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      setFieldErrors(undefined)

      const formData = new FormData(e.currentTarget)
      formData.set("role", role)

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
    [action, role, router],
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

          <AdministrationSelectedPersonHero
            firstName={firstName}
            lastName={lastName}
            profileKind={profileKind}
            email={defaultEmail}
          />

          <div className="space-y-8 px-5 py-8 sm:px-8">
            <section className="space-y-4">
              <AdministrationAccessSectionTitle
                kicker="Connexion"
                title="Identifiants"
                description="Email et rôle d'accès au dashboard Administration."
                icon={ADMINISTRATION_ACCESS_FORM_ICONS.connection}
              />
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email de connexion <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={defaultEmail}
                  className={administrationAccessInputClassName}
                  aria-invalid={!!fieldError(fieldErrors, "email")}
                />
                {fieldError(fieldErrors, "email") && (
                  <p className="text-xs text-destructive">{fieldError(fieldErrors, "email")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Rôle d&apos;accès <span className="text-destructive">*</span>
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className={administrationAccessSelectTriggerClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={administrationAccessSelectContentClassName}>
                    {roles.map((r) => (
                      <SelectItem key={r.code} value={r.code} className={administrationAccessSelectItemClassName}>
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="font-medium">{r.labelFr}</span>
                          {r.description && (
                            <span className="text-[11px] text-muted-foreground">{r.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            <Separator className="bg-border/60" />

            <section className="space-y-4">
              <AdministrationAccessSectionTitle
                kicker="Sécurité"
                title="Mot de passe"
                description="Laissez vide pour ne pas modifier le mot de passe actuel."
                icon={ADMINISTRATION_ACCESS_FORM_ICONS.security}
              />
              <div className="rounded-2xl border border-border/60 bg-muted/15 p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPwd ? "text" : "password"}
                        className={`${administrationAccessInputClassName} pr-10`}
                        autoComplete="new-password"
                        placeholder="Min. 8 caractères"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className={administrationAccessPasswordToggleClassName}
                        aria-label={showPwd ? "Masquer" : "Afficher"}
                      >
                        {showPwd ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirmer
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPwd2 ? "text" : "password"}
                        className={`${administrationAccessInputClassName} pr-10`}
                        autoComplete="new-password"
                        placeholder="Répéter le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd2((v) => !v)}
                        className={administrationAccessPasswordToggleClassName}
                        aria-label={showPwd2 ? "Masquer" : "Afficher"}
                      >
                        {showPwd2 ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                {fieldError(fieldErrors, "password") && (
                  <p className="mt-2 text-xs text-destructive">{fieldError(fieldErrors, "password")}</p>
                )}
                {fieldError(fieldErrors, "confirmPassword") && (
                  <p className="mt-1 text-xs text-destructive">{fieldError(fieldErrors, "confirmPassword")}</p>
                )}
              </div>
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className={cn("min-w-[160px] gap-2 rounded-xl", administrationPrimaryButtonClassName)}
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn("rounded-xl", administrationOutlineButtonClassName)}
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
