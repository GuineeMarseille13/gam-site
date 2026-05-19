"use client"

import { useState, useTransition, useCallback, useMemo, useEffect } from "react"
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
import { IconAlertCircle, IconEye, IconEyeOff, IconLoader2, IconUsers } from "@tabler/icons-react"
import {
  administrationOutlineButtonClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import { cn } from "@/helpers/utils"
import type { EligiblePersonForAdministrationAccess } from "../_services/get-eligible-persons-for-administration-access"
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

interface CreateAdministrationAccessFormProps {
  persons: EligiblePersonForAdministrationAccess[]
  roles: PermanenceAdminRole[]
  action: (formData: FormData) => Promise<AdministrationAccessActionResult>
}

function fieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fieldErrors?.[key]?.[0]
}

/**
 * Associe une personne sans compte à un rôle permanence administrative et un mot de passe.
 */
export function CreateAdministrationAccessForm({
  persons,
  roles,
  action,
}: CreateAdministrationAccessFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>()
  const [personId, setPersonId] = useState("")
  const [role, setRole] = useState<string>(roles[0]?.code ?? "PERMADMIN")
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [email, setEmail] = useState("")

  const selectedPerson = useMemo(
    () => persons.find((p) => p.id === personId) ?? null,
    [persons, personId],
  )

  useEffect(() => {
    setEmail(selectedPerson?.email ?? "")
  }, [selectedPerson])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      setFieldErrors(undefined)

      const formData = new FormData(e.currentTarget)
      formData.set("personId", personId)
      formData.set("role", role)
      formData.set("email", email.trim().toLowerCase())

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
    [action, personId, role, router, email],
  )

  if (persons.length === 0) {
    return (
      <Card className="max-w-2xl overflow-hidden border-dashed border-border/70 bg-muted/10">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
            <IconUsers className="size-6" aria-hidden />
          </span>
          <div>
            <p className="text-base font-semibold text-foreground">Aucune personne disponible</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Aucune personne n&apos;est enregistrée.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (roles.length === 0) {
    return (
      <Card className="max-w-2xl overflow-hidden border-dashed border-border/70 bg-muted/10">
        <CardContent className="px-6 py-14 text-center text-sm text-muted-foreground">
          Aucun rôle de permanence administrative n&apos;est configuré. Contactez un super administrateur.
        </CardContent>
      </Card>
    )
  }

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
            empty={!selectedPerson}
            firstName={selectedPerson?.firstName}
            lastName={selectedPerson?.lastName}
            profileKind={selectedPerson?.profileKind}
            posteLabel={selectedPerson?.posteLabel}
            email={selectedPerson?.email}
          />

          <div className="space-y-8 px-5 py-8 sm:px-8">
            <section className="space-y-4">
              <AdministrationAccessSectionTitle
                kicker="Étape 1"
                title="Sélectionner la personne"
                description="Liste des personnes sans compte dashboard."
                icon={ADMINISTRATION_ACCESS_FORM_ICONS.person}
              />
              <div className="space-y-2">
                <Label htmlFor="person-select" className="text-sm font-medium">
                  Personne <span className="text-destructive">*</span>
                </Label>
                <Select value={personId} onValueChange={setPersonId} required>
                  <SelectTrigger id="person-select" className={administrationAccessSelectTriggerClassName}>
                    <SelectValue placeholder="Rechercher ou choisir…" />
                  </SelectTrigger>
                  <SelectContent className={cn(administrationAccessSelectContentClassName, "max-h-72")}>
                    {persons.map((p) => (
                      <SelectItem key={p.id} value={p.id} className={administrationAccessSelectItemClassName}>
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="font-medium">
                            {p.firstName} {p.lastName}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {p.profileKind}
                            {p.posteLabel ? ` · ${p.posteLabel}` : ""}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError(fieldErrors, "personId") && (
                  <p className="text-xs text-destructive">{fieldError(fieldErrors, "personId")}</p>
                )}
              </div>
            </section>

            <Separator className="bg-border/60" />

            <section className="space-y-4">
              <AdministrationAccessSectionTitle
                kicker="Étape 2"
                title="Identifiants de connexion"
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
                  readOnly={!!selectedPerson?.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@gam.fr"
                  className={`${administrationAccessInputClassName} ${selectedPerson?.email ? "cursor-default bg-muted/40" : ""}`}
                  aria-invalid={!!fieldError(fieldErrors, "email")}
                />
                {selectedPerson && !selectedPerson.email && (
                  <p className="text-xs text-muted-foreground">
                    Cette personne n&apos;a pas d&apos;email enregistré — saisissez-en un pour la connexion.
                  </p>
                )}
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
                kicker="Étape 3"
                title="Mot de passe"
                description="Minimum 8 caractères. L'utilisateur pourra le modifier plus tard."
                icon={ADMINISTRATION_ACCESS_FORM_ICONS.security}
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
                      minLength={8}
                      required
                      autoComplete="new-password"
                      className={`${administrationAccessInputClassName} pr-10`}
                      aria-invalid={!!fieldError(fieldErrors, "password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className={administrationAccessPasswordToggleClassName}
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
                      className={`${administrationAccessInputClassName} pr-10`}
                      aria-invalid={!!fieldError(fieldErrors, "confirmPassword")}
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
                  {fieldError(fieldErrors, "confirmPassword") && (
                    <p className="text-xs text-destructive">{fieldError(fieldErrors, "confirmPassword")}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending || !personId}
                className={cn("min-w-[160px] gap-2 rounded-xl", administrationPrimaryButtonClassName)}
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    Création…
                  </>
                ) : (
                  "Créer l'accès"
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
