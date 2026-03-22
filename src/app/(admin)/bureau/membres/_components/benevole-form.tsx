"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconAlertCircle, IconLoader2, IconMapPin } from "@tabler/icons-react"
import { createBenevole } from "../_actions/actions"
import { AvatarUpload } from "@/components/bureau/avatar-upload"

export function BenevoleForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createBenevole(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      router.push("/bureau/membres")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo de profil */}
      <AvatarUpload
        withVisibilityToggle
        placeholderClass="from-violet-100 to-violet-200 text-violet-600"
      />

      <div className="border-t" />

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
          <IconAlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Prénom + Nom côte à côte */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Prénom
          </Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Jean"
            required
            autoFocus
            className="h-10 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Nom
          </Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Dupont"
            required
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Téléphone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Téléphone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          required
          className="h-10 rounded-xl"
        />
      </div>

      {/* Email (optionnel) */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Email <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
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
          id="address"
          name="address"
          placeholder="12 rue de la Paix"
          className="h-10 rounded-xl"
        />
      </div>

      {/* Code postal + Ville côte à côte */}
      <div className="grid grid-cols-[2fr_3fr] gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Code postal
          </Label>
          <Input
            id="zipCode"
            name="zipCode"
            placeholder="75001"
            className="h-10 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Ville
          </Label>
          <Input
            id="city"
            name="city"
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
          id="country"
          name="country"
          placeholder="France"
          defaultValue="France"
          className="h-10 rounded-xl"
        />
      </div>

      {/* Séparateur */}
      <div className="border-t" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={isPending}
          className="cursor-pointer gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm shadow-violet-500/20"
        >
          {isPending && <IconLoader2 className="size-4 animate-spin" />}
          Ajouter le bénévole
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
    </form>
  )
}
