"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import {
  administrationCardClassName,
  administrationIconBadgeClassName,
  administrationMutedSurfaceClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import { cn } from "@/helpers/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { IconSchool } from "@tabler/icons-react"

import { saveAdministrativePermanenceSettingsAction } from "../_actions/manage-administrative-permanence"

interface CampusFrancePublicToggleCardProps {
  initialShowCampusFranceCard: boolean
}

/**
 * Composant: CampusFrancePublicToggleCard
 * Rôle: Activer / désactiver le bloc Campus France sur la page publique du pôle administratif.
 */
export function CampusFrancePublicToggleCard({
  initialShowCampusFranceCard,
}: CampusFrancePublicToggleCardProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [showCampusFranceCard, setShowCampusFranceCard] = useState(
    initialShowCampusFranceCard,
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setShowCampusFranceCard(initialShowCampusFranceCard)
  }, [initialShowCampusFranceCard])

  const refresh = useCallback(() => {
    router.refresh()
  }, [router])

  const handleSave = useCallback(() => {
    setError(null)
    startTransition(async () => {
      const res = await saveAdministrativePermanenceSettingsAction({
        showCampusFranceCard,
      })
      if (!res.success) {
        setError(res.error)
        return
      }
      refresh()
    })
  }, [refresh, showCampusFranceCard])

  return (
    <Card className={cn(administrationCardClassName, "overflow-hidden")}>
      <CardHeader className="space-y-1">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            administrationIconBadgeClassName,
          )}
        >
          <IconSchool className="size-5 text-sky-600" aria-hidden />
        </div>
        <CardTitle className="text-xl">Bloc « Campus France — votre dossier » (site)</CardTitle>
        <CardDescription>
          Affiche ou masque le bloc de dépôt Campus France sur la page publique du pôle Démarche
          administrative.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-xl p-4",
            administrationMutedSurfaceClassName,
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Afficher le bloc Campus France</p>
            <p className="text-xs text-muted-foreground">
              Désactivez si vous ne souhaitez pas proposer le formulaire sur le site.
            </p>
          </div>
          <Switch
            checked={showCampusFranceCard}
            onCheckedChange={setShowCampusFranceCard}
            aria-label="Afficher le bloc Campus France"
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          className={administrationPrimaryButtonClassName}
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Enregistrement…
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

