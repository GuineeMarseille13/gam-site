import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconPlus } from "@tabler/icons-react"
import { RowActions } from "@/components/bureau/row-actions"
import { ContactInfoForm } from "./_components/contact-info-form"
import { upsertContact, deleteSocialMedia } from "./_actions/actions"

export const metadata: Metadata = { title: "Contact" }

export default async function ContactPage() {
  const [contact, socialMedias, pendingCount] = await Promise.all([
    prisma.contact.findFirst(),
    prisma.socialMedia.findMany({ orderBy: { order: "asc" } }),
    prisma.contactSubmission.count({ where: { status: "PENDING" } }),
  ])

  return (
    <BureauDataPage
      title="Contact"
      description="Informations de contact affichées sur le site public"
    >
      <div className="grid gap-6">
        {/* ── Informations de contact ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations de contact</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactInfoForm action={upsertContact} defaultValues={contact ?? undefined} />
          </CardContent>
        </Card>

        {/* ── Réseaux sociaux ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Réseaux sociaux</CardTitle>
            <Button asChild size="sm" className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
              <Link href="/bureau/contact/reseaux-sociaux/nouveau">
                <IconPlus className="size-4" />
                Ajouter
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {/* Mobile : cartes */}
            <div className="sm:hidden divide-y">
              {socialMedias.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Aucun réseau social configuré
                </p>
              ) : (
                socialMedias.map((sm) => (
                  <div key={sm.id} className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{sm.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{sm.url}</p>
                    </div>
                    <RowActions
                      editHref={`/bureau/contact/reseaux-sociaux/${sm.id}/modifier`}
                      onDelete={deleteSocialMedia.bind(null, sm.id)}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Tablette / Desktop : table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Réseau</TableHead>
                    <TableHead className="hidden md:table-cell">Identifiant icône</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="hidden md:table-cell">Ordre</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialMedias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        Aucun réseau social configuré
                      </TableCell>
                    </TableRow>
                  ) : (
                    socialMedias.map((sm) => (
                      <TableRow key={sm.id}>
                        <TableCell className="pl-6 font-medium">{sm.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{sm.icon ?? "—"}</TableCell>
                        <TableCell className="max-w-[16rem] truncate text-muted-foreground text-sm">
                          {sm.url}
                        </TableCell>
                        <TableCell className="hidden md:table-cell tabular-nums text-muted-foreground">{sm.order}</TableCell>
                        <TableCell className="pr-6">
                          <RowActions
                            editHref={`/bureau/contact/reseaux-sociaux/${sm.id}/modifier`}
                            onDelete={deleteSocialMedia.bind(null, sm.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ── Messages reçus ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Messages reçus</CardTitle>
              {pendingCount > 0 && (
                <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                  {pendingCount} en attente
                </Badge>
              )}
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/bureau/contact/messages">Voir tous les messages</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </BureauDataPage>
  )
}
