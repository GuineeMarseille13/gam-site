"use client"

import Link from "next/link"
import {
  IconArrowRight,
  IconBuildingStore,
  IconHome,
  IconUserCircle,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react"

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
  initialShowHebergementForm: boolean  // ← nouveau prop
}

export function HerbergementRelationOverviewGrid({
  firstName,
  initialShowHebergementForm,
}: HerbergementRelationOverviewGridProps) {
  const permissions = useHerbergementRelationPermissions()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {firstName ? `Bonjour, ${firstName}` : "Hébergement et mise en relation"}
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Gestion des accès dédiés à l'équipe hébergement et mise en relation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Carte Mon profil */}
        <Card className={hebergementRelationCardClassName}>
          <CardHeader className="pb-2">
            <div className={cn("flex size-10 items-center justify-center rounded-xl", hebergementRelationIconBadgeClassName)}>
              <IconUserCircle className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Mon profil</CardTitle>
            <CardDescription>Coordonnées, photo et mot de passe de votre compte.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className={cn("w-full gap-2", hebergementRelationOutlineButtonClassName)}>
              <Link href="/hebergement-relation/profil">
                Gérer mon profil
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Carte Propositions d'hébergement */}
        {permissions.canAccessHerbergementAcces && (
          <Card className={hebergementRelationCardClassName}>
            <CardHeader className="pb-2">
              <div className={cn("flex size-10 items-center justify-center rounded-xl", hebergementRelationIconBadgeClassName)}>
                <IconBuildingStore className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">Propositions d'hébergement</CardTitle>
              <CardDescription>
                Hébergeurs disponibles — consulter et gérer les propositions reçues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className={cn("w-full gap-2", hebergementRelationPrimaryButtonClassName)}>
                <Link href="/hebergement-relation/proposition_hebergement">
                  Ouvrir la liste
                  <IconArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Carte Demandes d'hébergement */}
        {permissions.canAccessHerbergementAcces && (
          <Card className={hebergementRelationCardClassName}>
            <CardHeader className="pb-2">
              <div className={cn("flex size-10 items-center justify-center rounded-xl", hebergementRelationIconBadgeClassName)}>
                <IconUsers className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">Demandes d'hébergement</CardTitle>
              <CardDescription>
                Personnes en recherche — consulter et traiter les demandes reçues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className={cn("w-full gap-2", hebergementRelationPrimaryButtonClassName)}>
                <Link href="/hebergement-relation/demande_hebergement">
                  Ouvrir la liste
                  <IconArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Carte Accès équipe */}
        {permissions.canAccessHerbergementAcces && (
          <Card className={hebergementRelationCardClassName}>
            <CardHeader className="pb-2">
              <div className={cn("flex size-10 items-center justify-center rounded-xl", hebergementRelationIconBadgeClassName)}>
                <IconUserPlus className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">Accès équipe</CardTitle>
              <CardDescription>
                Comptes du dashboard Hébergement et mise en relation
                {permissions.canManageHerbergementAcces ? " — création et modification." : " — consultation."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="secondary" className={cn("w-full gap-2 sm:flex-1", hebergementRelationPrimaryButtonClassName)}>
                <Link href="/hebergement-relation/acces">
                  Voir les accès
                  <IconArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              {permissions.canManageHerbergementAcces && (
                <Button asChild variant="outline" className={cn("w-full sm:flex-1", hebergementRelationOutlineButtonClassName)}>
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