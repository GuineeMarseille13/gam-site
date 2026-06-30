"use client"

import Link from "next/link"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { administrationPrimaryButtonClassName } from "@/config/administration-dashboard-theme"
import { cn } from "@/helpers/utils"
import type { BenevoleActionResult } from "@/app/(admin)/bureau/benevoles/_types/benevole-action-result"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AvatarUpload } from "@/components/bureau/avatar-upload"
import { IconAlertCircle, IconLoader2, IconMapPin } from "@tabler/icons-react"

type DashboardBase = "/bureau" | "/administration"

interface BenevoleFormProps {
  action: (formData: FormData) => Promise<BenevoleActionResult>
  submitLabel?: string
  /** Préfixe du dashboard pour annulation et redirection client */
  dashboardBase?: DashboardBase
  defaultValues?: {
    firstName?: string
    lastName?: string
    email?: string | null
    phone?: string
    showOnSite?: boolean
    imageUrl?: string | null
    address?: string | null
    zipCode?: string | null
    city?: string | null
    country?: string | null
  }
}

/**
 * Formulaire bénévole (création / édition) — validation serveur + retour d'erreur.
 */
export function BenevoleForm({
  action,
  submitLabel = "Enregistrer",
  dashboardBase = "/bureau",
  defaultValues,
}: BenevoleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const cancelHref = `${dashboardBase}/benevoles`
  const isAdministration = dashboardBase === "/administration"

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await action(formData)

      if ("error" in result) {
        setError(result.error)
        return
      }

      router.push(cancelHref)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <input type="hidden" name="dashboardBase" value={dashboardBase} />

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
          <IconAlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      <AvatarUpload
        withVisibilityToggle
        defaultImageUrl={defaultValues?.imageUrl}
        defaultShowOnSite={defaultValues?.showOnSite ?? true}
        administrationChrome={isAdministration}
        placeholderClass={
          isAdministration
            ? "from-sky-100 to-sky-200 text-sky-700 dark:from-sky-900/55 dark:to-sky-800/40 dark:text-sky-200"
            : "from-violet-100 to-violet-200 text-violet-600"
        }
        visibilitySubLabel="Section « Nos bénévoles »"
      />

      <div className="border-t" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
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
        <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Email <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
        </Label>
        <Input
          id="email" name="email" type="email"
          defaultValue={defaultValues?.email ?? ""}
          placeholder="jean@exemple.fr"
          className="h-10 rounded-xl"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <IconMapPin className="size-3.5" />
          Adresse <span className="normal-case font-normal">(optionnel)</span>
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Rue
        </Label>
        <Input
          id="address" name="address"
          defaultValue={defaultValues?.address ?? ""}
          placeholder="12 rue de la Paix"
          className="h-10 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-[2fr_3fr] gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Code postal
          </Label>
          <Input
            id="zipCode" name="zipCode"
            defaultValue={defaultValues?.zipCode ?? ""}
            placeholder="75001"
            className="h-10 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Ville
          </Label>
          <Input
            id="city" name="city"
            defaultValue={defaultValues?.city ?? ""}
            placeholder="Paris"
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Pays
        </Label>
        <Input
          id="country" name="country"
          defaultValue={defaultValues?.country ?? "France"}
          placeholder="France"
          className="h-10 rounded-xl"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className={cn(
            "h-10 min-h-10 rounded-xl px-5 text-sm font-semibold sm:px-6",
            isAdministration ? administrationPrimaryButtonClassName : null,
          )}
        >
          {isPending ? (
            <>
              <IconLoader2 className="size-4 animate-spin" />
              Enregistrement…
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <Button
          variant="ghost"
          asChild
          disabled={isPending}
          className="h-10 min-h-10 rounded-xl px-4 text-sm font-medium sm:px-5"
        >
          <Link href={cancelHref}>Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
