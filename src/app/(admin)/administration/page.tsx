import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import {
  IconHandStop,
  IconChartBar,
  IconUserCircle,
  IconArrowRight,
  IconUserPlus,
  IconCalendarCheck,
  IconClipboardList,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Vue d'ensemble" }

/** CTA plein des cartes — plus clair que `secondary` (#2563eb), survol progressif. */
const administrationHomePrimaryCtaClassName = cn(
  "bg-sky-500 text-white shadow-sm shadow-sky-500/18",
  "transition-[background-color,box-shadow]",
  "hover:bg-sky-600 hover:shadow-md hover:shadow-sky-600/22",
  "active:bg-sky-700",
  "dark:bg-sky-600 dark:shadow-sky-950/35",
  "dark:hover:bg-sky-500 dark:hover:shadow-md dark:hover:shadow-sky-500/25",
)

/** CTA contour — bordure sky, hover lisible sans gris trop neutre. */
const administrationHomeOutlineCtaClassName = cn(
  "border-sky-200/90 bg-background text-sky-900 shadow-xs",
  "transition-[color,box-shadow,background-color,border-color]",
  "hover:border-sky-400/90 hover:bg-sky-50 hover:text-sky-950",
  "active:bg-sky-100/80",
  "dark:border-sky-700 dark:bg-card dark:text-sky-100",
  "dark:hover:border-sky-500 dark:hover:bg-sky-950/45 dark:hover:text-sky-50",
)

export default async function AdministrationHomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const firstName = session?.user.name?.split(/\s+/)[0] ?? ""
  const isAdmin = session?.user.role === "admin"

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
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400">
              <IconUserPlus className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Accès administration</CardTitle>
            <CardDescription>
              Lister les comptes rôle Administration, modifier ou créer un accès
              {isAdmin ? " (création réservée aux administrateurs)" : "."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              variant="secondary"
              className={cn("w-full gap-2 sm:flex-1", administrationHomePrimaryCtaClassName)}
            >
              <Link href="/administration/acces">
                Gérer les accès
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            {isAdmin && (
              <Button
                asChild
                variant="outline"
                className={cn("w-full sm:flex-1", administrationHomeOutlineCtaClassName)}
              >
                <Link href="/administration/nouveau-compte">Nouveau compte</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400">
              <IconCalendarCheck className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Permanence administrative</CardTitle>
            <CardDescription>
              Liste de présence à la permanence ADM (ex-Google Form) : date, membre, heures,
              commentaire.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="secondary"
              className={cn("w-full gap-2", administrationHomePrimaryCtaClassName)}
            >
              <Link href="/administration/permanence-administrative">
                Enregistrer une présence
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400">
              <IconClipboardList className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Demande bénéficiaire</CardTitle>
            <CardDescription>
              Enregistrement des demandes à la permanence administrative (types de demande, identité)
              — ex-Google Form suivi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="secondary"
              className={cn("w-full gap-2", administrationHomePrimaryCtaClassName)}
            >
              <Link href="/administration/demande-beneficiaire">
                Nouvelle fiche
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400">
              <IconHandStop className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Bénévoles</CardTitle>
            <CardDescription>
              Ajouter, modifier ou retirer des bénévoles affichés sur le site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="secondary"
              className={cn("w-full gap-2", administrationHomePrimaryCtaClassName)}
            >
              <Link href="/administration/benevoles">
                Ouvrir la liste
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400">
              <IconChartBar className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Statistiques</CardTitle>
            <CardDescription>
              Tableaux de bord à venir — réservé pour vos indicateurs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className={cn("w-full gap-2", administrationHomeOutlineCtaClassName)}
            >
              <Link href="/administration/statistiques">
                Voir la page
                <IconArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400">
              <IconUserCircle className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg">Profil</CardTitle>
            <CardDescription>
              Coordonnées et mot de passe du compte connecté.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className={cn("w-full gap-2", administrationHomeOutlineCtaClassName)}
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
