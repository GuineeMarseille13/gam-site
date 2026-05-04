"use client"

import Link from "next/link"
import { administrationPrimaryButtonClassName } from "@/config/administration-dashboard-theme"
import { cn } from "@/helpers/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"
import { AvatarUpload } from "@/components/bureau/avatar-upload"
import { IconMapPin } from "@tabler/icons-react"

type DashboardBase = "/bureau" | "/administration"

interface BenevoleFormProps {
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
  /** Préfixe du dashboard pour annulation et redirection serveur */
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

export function BenevoleForm({
  action,
  submitLabel = "Enregistrer",
  dashboardBase = "/bureau",
  defaultValues,
}: BenevoleFormProps) {
  const cancelHref = `${dashboardBase}/benevoles`
  const isAdministration = dashboardBase === "/administration"

  return (
    <form action={action} className="space-y-6 max-w-xl">
      <input type="hidden" name="dashboardBase" value={dashboardBase} />

      {/* Photo de profil */}
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

      {/* Prénom + Nom */}
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

      {/* Téléphone */}
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

      {/* Email */}
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

      {/* Séparateur adresse */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <IconMapPin className="size-3.5" />
          Adresse <span className="normal-case font-normal">(optionnel)</span>
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Rue */}
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

      {/* Code postal + Ville */}
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

      {/* Pays */}
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

      {/* Actions — même hauteur que les champs (h-10), largeur confortable */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <SubmitButton
          className={cn(
            "h-10 min-h-10 rounded-xl px-5 text-sm font-semibold sm:px-6",
            isAdministration ? administrationPrimaryButtonClassName : null,
          )}
        >
          {submitLabel}
        </SubmitButton>
        <Button
          variant="ghost"
          asChild
          className="h-10 min-h-10 rounded-xl px-4 text-sm font-medium sm:px-5"
        >
          <Link href={cancelHref}>Annuler</Link>
        </Button>
      </div>

    </form>
  )
}
