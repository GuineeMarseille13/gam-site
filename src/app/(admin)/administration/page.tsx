import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  IconHandStop,
  IconChartBar,
  IconUserCircle,
  IconArrowRight,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Vue d'ensemble" }

export default async function AdministrationHomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const firstName = session?.user.name?.split(/\s+/)[0] ?? ""

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
            <Button asChild variant="secondary" className="w-full gap-2">
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
            <Button asChild variant="outline" className="w-full gap-2">
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
            <Button asChild variant="outline" className="w-full gap-2">
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
