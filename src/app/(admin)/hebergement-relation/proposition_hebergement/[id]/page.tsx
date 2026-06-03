// src/app/(bureau)/hebergement-relation/proposition_hebergement/[id]/page.tsx

import { notFound } from "next/navigation"
import Link from "next/link"
import { IconCheck, IconClock, IconHome, IconX, IconLock } from "@tabler/icons-react"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function PropositionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const proposition = await prisma.propositionHebergement.findUnique({
    where: { id },
  })
  if (!proposition) notFound()

  return (
    <BureauContent
      title={`${proposition.prenom} ${proposition.nom}`}
      description={`Proposition reçue le ${new Date(proposition.createdAt).toLocaleDateString("fr-FR")}`}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">

          {/* Contact */}
          <Section title="Contact">
            <Grid>
              <Field label="Email" value={proposition.email} />
              <Field label="Téléphone" value={proposition.telephone} />
              <Field label="Adresse" value={proposition.adresse} wide />
            </Grid>
          </Section>

          <div className="border-t" />

          {/* Hébergement */}
          <Section title="Hébergement">
            <Grid>
              <Field label="Nb. personnes" value={`${proposition.nbPersonnes} personne(s)`} />
              <Field
                label="Disponible dès"
                value={new Date(proposition.dateDebut).toLocaleDateString("fr-FR")}
              />
              <Field label="Durée" value={`${proposition.dureeJours} jours`} />
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Statut
                </p>
                <StatutBadge statut={proposition.statut} />
              </div>
            </Grid>
          </Section>

          {/* Description  du logement— toujours affiché si présent */}
          {proposition.description && (
            <>
              <div className="border-t" />
              <Section title="Message du demandeur">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {proposition.description}
                </p>
              </Section>
            </>
          )}


          {/* Notes admin */}
          {proposition.notesAdmin && (
            <>
              <div className="border-t" />
              <Section title="Notes admin">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {proposition.notesAdmin}
                </p>
              </Section>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button asChild className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
              <Link href={`/hebergement-relation/proposition_hebergement/${id}/modifier`}>
                Modifier
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-9 px-4 rounded-xl text-sm">
              <Link href="/hebergement-relation/proposition_hebergement">
                Retour à la liste
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </BureauContent>
  )
}

// ─── Sous-composants ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

function Field({
  label,
  value,
  wide = false,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

type StatutProp = "EN_ATTENTE" | "VALIDE" | "OCCUPE" | "REFUSE" | "CLOTURE"

function StatutBadge({ statut }: { statut: StatutProp }) {
  switch (statut) {
    case "VALIDE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
          <IconCheck className="size-3" /> Validé
        </span>
      )
    case "OCCUPE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
          <IconHome className="size-3" /> Occupé
        </span>
      )
    case "REFUSE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
          <IconX className="size-3" /> Refusé
        </span>
      )
    case "CLOTURE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
          <IconLock className="size-3" /> Clôturé
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
          <IconClock className="size-3" /> En attente
        </span>
      )
  }
}