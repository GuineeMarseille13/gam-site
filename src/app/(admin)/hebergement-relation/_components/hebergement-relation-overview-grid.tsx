"use client"

import Link from "next/link"
import { IconArrowRight, IconUserCircle, IconUserPlus } from "@tabler/icons-react"

import { useHerbergementRelationPermissions } from "@/app/(admin)/hebergement-relation/_components/hebergement-relation-permissions-provider"
import {
  hebergementRelationCardClassName,
  hebergementRelationIconBadgeClassName,
  hebergementRelationOutlineButtonClassName,
  hebergementRelationPrimaryButtonClassName,
} from "@/config/hebergement-relation-dashboard-theme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/helpers/utils"

interface HerbergementRelationOverviewGridProps {
  firstName: string
}

/**
 * Cartes d’accès rapide — dashboard Hébergement et mise en relation.
 */
export function HerbergementRelationOverviewGrid({
  firstName,
}: HerbergementRelationOverviewGridProps) {
  const permissions = useHerbergementRelationPermissions()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {firstName ? `Bonjour, ${firstName}` : "Hébergement et mise en relation"}
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Gestion des accès dédiés à l’équipe hébergement et mise en relation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className={hebergementRelationCardClassName}>
          <CardHeader className="pb-2">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                hebergementRelationIconBadgeClassName,
              )}
            >
              <IconUserCircle className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Mon profil</CardTitle>
            <CardDescription>
              Coordonnées, photo et mot de passe de votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className={cn("w-full gap-2", hebergementRelationOutlineButtonClassName)}
            >
              <Link href="/hebergement-relation/profil">
                Gérer mon profil
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>

      {permissions.canAccessHerbergementAcces && (
        <Card className={hebergementRelationCardClassName}>
          <CardHeader className="pb-2">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                hebergementRelationIconBadgeClassName,
              )}
            >
              <IconUserPlus className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Accès équipe</CardTitle>
            <CardDescription>
              Comptes du dashboard Hébergement et mise en relation
              {permissions.canManageHerbergementAcces
                ? " — création et modification."
                : " — consultation."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              variant="secondary"
              className={cn("w-full gap-2 sm:flex-1", hebergementRelationPrimaryButtonClassName)}
            >
              <Link href="/hebergement-relation/acces">
                Voir les accès
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            {permissions.canManageHerbergementAcces && (
              <Button
                asChild
                variant="outline"
                className={cn("w-full sm:flex-1", hebergementRelationOutlineButtonClassName)}
              >
                <Link href="/hebergement-relation/acces/nouveau">Nouvel accès</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}
