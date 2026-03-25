import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  IconHandStop,
  IconChartBar,
  IconUserCircle,
  IconArrowRight,
  IconUserPlus,
  IconCalendarCheck,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Vue d'ensemble" }

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
        <Card className="border-border/60 border-sky-200/60 bg-sky-50/30 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/20">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/15">
              <IconUserPlus className="size-5 text-sky-600" />
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
              className="w-full gap-2 bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 sm:flex-1"
            >
              <Link href="/administration/acces">
                Gérer les accès
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
            {isAdmin && (
              <Button
                asChild
                variant="outline"
                className="w-full border-sky-300/60 hover:border-sky-400 hover:bg-sky-50 hover:text-foreground sm:flex-1 dark:border-sky-800 dark:hover:border-sky-600 dark:hover:bg-sky-950/50"
              >
                <Link href="/administration/nouveau-compte">Nouveau compte</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 border-sky-200/40 bg-sky-50/20 shadow-sm dark:border-sky-900/35 dark:bg-sky-950/15">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/15">
              <IconCalendarCheck className="size-5 text-sky-600" />
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
              className="w-full gap-2 hover:bg-sky-200/60 hover:text-foreground dark:hover:bg-sky-900/50"
            >
              <Link href="/administration/permanence-administrative">
                Enregistrer une présence
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
              <IconHandStop className="size-5 text-sky-600" />
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
              className="w-full gap-2 hover:bg-sky-200/60 hover:text-foreground dark:hover:bg-sky-900/50"
            >
              <Link href="/administration/benevoles">
                Ouvrir la liste
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
              <IconChartBar className="size-5 text-sky-600" />
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
              className="w-full gap-2 border-sky-200/80 hover:border-sky-400 hover:bg-sky-50 hover:text-foreground dark:border-sky-800 dark:hover:border-sky-600 dark:hover:bg-sky-950/50"
            >
              <Link href="/administration/statistiques">
                Voir la page
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
              <IconUserCircle className="size-5 text-sky-600" />
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
              className="w-full gap-2 border-sky-200/80 hover:border-sky-400 hover:bg-sky-50 hover:text-foreground dark:border-sky-800 dark:hover:border-sky-600 dark:hover:bg-sky-950/50"
            >
              <Link href="/administration/profil">
                Mon profil
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
