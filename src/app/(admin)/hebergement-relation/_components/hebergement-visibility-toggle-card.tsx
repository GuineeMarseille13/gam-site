"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { IconHome } from "@tabler/icons-react"

import {
  hebergementRelationCardClassName,
  hebergementRelationIconBadgeClassName,
  hebergementRelationMutedSurfaceClassName,
  hebergementRelationPrimaryButtonClassName,
} from "@/config/hebergement-relation-dashboard-theme"
import { cn } from "@/helpers/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"


import { saveHebergementVisibilityAction } from "../actions/manage-hebergement-visibility"

interface HebergementVisibilityToggleCardProps {
  initialShowHebergementForm: boolean
}

/**
 * Composant: HebergementVisibilityToggleCard
 * Rôle: Activer / désactiver le bloc "Proposer un hébergement" sur la page publique.
 */
export function HebergementVisibilityToggleCard({
  initialShowHebergementForm,
}: HebergementVisibilityToggleCardProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(initialShowHebergementForm)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setShowForm(initialShowHebergementForm)
  }, [initialShowHebergementForm])

  const handleSave = useCallback(() => {
    setError(null)
    startTransition(async () => {
      const res = await saveHebergementVisibilityAction({ showHebergementForm: showForm })
      if (!res.success) {
        setError(res.error)
        return
      }
      router.refresh()
    })
  }, [router, showForm])

  return (
    <Card className={cn(hebergementRelationCardClassName, "overflow-hidden")}>
      <CardHeader className="space-y-1">
        <div className={cn("flex size-10 items-center justify-center rounded-xl", hebergementRelationIconBadgeClassName)}>
          <IconHome className="size-5 text-emerald-600" aria-hidden />
        </div>
        <CardTitle className="text-xl">Bloc « Proposer un hébergement » (visibile sur le site)</CardTitle>
        <CardDescription>
          Affiche ou masque le bloc d'hébergement sur la page publique du pôle Hébergement et Mise en Relation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={cn("flex items-center justify-between gap-4 rounded-xl p-4", hebergementRelationMutedSurfaceClassName)}>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Afficher le bloc hébergement</p>
            <p className="text-xs text-muted-foreground">
              Désactivez si vous ne souhaitez pas afficher le bloc de proposition d'hébergement sur la page publique.
            </p>
          </div>
          <Switch
            checked={showForm}
            onCheckedChange={setShowForm}
            aria-label="Afficher le bloc hébergement"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        )}

        <Button
          type="button"
          className={hebergementRelationPrimaryButtonClassName}
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? (
            <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden />Enregistrement…</>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}