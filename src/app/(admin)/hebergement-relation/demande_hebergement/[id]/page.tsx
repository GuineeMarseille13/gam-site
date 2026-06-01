import { notFound } from "next/navigation"
import Link from "next/link"
import { IconCheck, IconClock, IconX } from "@tabler/icons-react"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function DemandeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const demande = await prisma.demandeHebergement.findUnique({ where: { id } })
  if (!demande) notFound()

  return (
    <BureauContent
      title={`${demande.prenom} ${demande.nom}`}
      description={`Demande reçue le ${new Date(demande.createdAt).toLocaleDateString("fr-FR")}`}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">

          <Section title="Contact">
            <Grid>
              <Field label="Email" value={demande.email} />
              <Field label="Téléphone" value={demande.telephone} />
              <Field label="Adresse actuelle" value={demande.adresse} wide />
            </Grid>
          </Section>

          <div className="border-t" />

          <Section title="Hébergement recherché">
            <Grid>
              <Field label="Nb. personnes" value={`${demande.nbPersonnes} personne(s)`} />
              <Field
                label="Date d'arrivée"
                value={new Date(demande.dateArrivee).toLocaleDateString("fr-FR")}
              />
              <Field label="Durée" value={`${demande.dureeJours} jours`} />
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Statut
                </p>
                <StatutBadge statut={demande.statut} />
              </div>
            </Grid>
          </Section>

          {demande.description && (
            <>
              <div className="border-t" />
              <Section title="Message du demandeur">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {demande.description}
                </p>
              </Section>
            </>
          )}

          {demande.notesAdmin && (
            <>
              <div className="border-t" />
              <Section title="Notes admin">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {demande.notesAdmin}
                </p>
              </Section>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button asChild className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
              <Link href={`/hebergement-relation/demande_hebergement/${id}/modifier`}>
                Modifier
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 rounded-xl">
              <Link href="/hebergement-relation/demande_hebergement">
                Retour à la liste
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </BureauContent>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function StatutBadge({ statut }: { statut: "EN_ATTENTE" | "TRAITEE" | "REFUSEE" }) {
  if (statut === "TRAITEE") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
      <IconCheck className="size-3" /> Traitée
    </span>
  )
  if (statut === "REFUSEE") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
      <IconX className="size-3" /> Refusée
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
      <IconClock className="size-3" /> En attente
    </span>
  )
}