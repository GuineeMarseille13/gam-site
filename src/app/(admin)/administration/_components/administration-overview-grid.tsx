"use client"

import Link from "next/link"
import {
  IconArrowRight,
  IconCalendar,
  IconCalendarCheck,
  IconChartBar,
  IconClipboardList,
  IconHandStop,
  IconSchool,
  IconUserCircle,
  IconUserPlus,
} from "@tabler/icons-react"

import { useAdministrationPermissions } from "@/app/(admin)/administration/_components/administration-permissions-provider"
import {
  administrationCardClassName,
  administrationIconBadgeClassName,
  administrationOutlineButtonClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/helpers/utils"

interface AdministrationOverviewGridProps {
  firstName: string
}

/**
 * Cartes d’accès rapide du dashboard Administration — filtrées par permissions session.
 */
export function AdministrationOverviewGrid({ firstName }: AdministrationOverviewGridProps) {
  const permissions = useAdministrationPermissions()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {firstName ? `Bonjour, ${firstName}` : "Espace administration"}
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Gestion des bénévoles et accès à votre profil — même espace que le bureau, version ciblée.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {permissions.canAccessAdministrationAcces && (
          <Card className={administrationCardClassName}>
            <CardHeader className="pb-2">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  administrationIconBadgeClassName,
                )}
              >
                <IconUserPlus className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">Accès administration</CardTitle>
              <CardDescription>
                Lister les comptes rôle Administration
                {permissions.canManageAdministrationAcces
                  ? ", modifier ou créer un accès."
                  : "."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                className={cn("w-full gap-2 sm:flex-1", administrationPrimaryButtonClassName)}
              >
                <Link href="/administration/acces">
                  Gérer les accès
                  <IconArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              {permissions.canManageAdministrationAcces && (
                <Button
                  asChild
                  variant="outline"
                  className={cn("w-full sm:flex-1", administrationOutlineButtonClassName)}
                >
                  <Link href="/administration/acces/nouveau">Nouvel accès</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {permissions.canAccessAdminPresence && (
          <Card className={administrationCardClassName}>
            <CardHeader className="pb-2">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  administrationIconBadgeClassName,
                )}
              >
                <IconCalendarCheck className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">Permanence administrative</CardTitle>
              <CardDescription>
                Liste de présence à la permanence ADM : date, membre, heures, commentaire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="secondary"
                className={cn("w-full gap-2", administrationPrimaryButtonClassName)}
              >
                <Link href="/administration/permanence-administrative">
                  Enregistrer une présence
                  <IconArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {permissions.canAccessAdminCalendrier && (
          <Card className={administrationCardClassName}>
            <CardHeader className="pb-2">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  administrationIconBadgeClassName,
                )}
              >
                <IconCalendar className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">Calendrier permanence</CardTitle>
              <CardDescription>
                Créneaux affichés sur le site public et texte de la carte horaires.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="secondary"
                className={cn("w-full gap-2", administrationPrimaryButtonClassName)}
              >
                <Link href="/administration/calendrier-permanence">
                  Configurer le calendrier
                  <IconArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {permissions.canAccessAdminCampusFrance && (
          <OverviewLinkCard
            title="Campus France — dépôts"
            description="Consultez les dossiers envoyés depuis le formulaire public."
            href="/administration/campus-france-depots"
            label="Ouvrir la liste"
            icon={IconSchool}
          />
        )}

        {permissions.canAccessAdminDemandeBeneficiaire && (
          <OverviewLinkCard
            title="Demande bénéficiaire"
            description="Enregistrement des demandes à la permanence administrative."
            href="/administration/demande-beneficiaire"
            label="Nouvelle fiche"
            icon={IconClipboardList}
          />
        )}

        {permissions.canAccessAdminBenevolesList && (
          <OverviewLinkCard
            title="Bénévoles"
            description={
              permissions.canManageAdminBenevoles
                ? "Ajouter, modifier ou retirer des bénévoles affichés sur le site."
                : "Consulter la liste des bénévoles de l'association."
            }
            href="/administration/benevoles"
            label="Ouvrir la liste"
            icon={IconHandStop}
          />
        )}

        {permissions.canAccessAdminStatistiques && (
          <OverviewLinkCard
            title="Statistiques"
            description="Tableaux de bord et indicateurs de permanence."
            href="/administration/statistiques"
            label="Voir la page"
            icon={IconChartBar}
            variant="outline"
          />
        )}

        <Card
          className={cn(
            administrationCardClassName,
            "sm:col-span-2 lg:col-span-1",
          )}
        >
          <CardHeader className="pb-2">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                administrationIconBadgeClassName,
              )}
            >
              <IconUserCircle className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Profil</CardTitle>
            <CardDescription>Coordonnées et mot de passe du compte connecté.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className={cn("w-full gap-2", administrationOutlineButtonClassName)}
            >
              <Link href="/administration/profil">
                Mon profil
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface OverviewLinkCardProps {
  title: string
  description: string
  href: string
  label: string
  icon: React.ElementType
  variant?: "secondary" | "outline"
}

function OverviewLinkCard({
  title,
  description,
  href,
  label,
  icon: Icon,
  variant = "secondary",
}: OverviewLinkCardProps) {
  return (
    <Card className={administrationCardClassName}>
      <CardHeader className="pb-2">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            administrationIconBadgeClassName,
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          variant={variant}
          className={cn(
            "w-full gap-2",
            variant === "outline"
              ? administrationOutlineButtonClassName
              : administrationPrimaryButtonClassName,
          )}
        >
          <Link href={href}>
            {label}
            <IconArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
