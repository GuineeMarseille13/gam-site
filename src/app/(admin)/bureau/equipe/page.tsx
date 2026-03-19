import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { IconUsers } from "@tabler/icons-react"
import { RowActions } from "@/components/bureau/row-actions"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { getPosteLabel } from "./_components/postes"
import { deleteMembreEquipe } from "./_actions/actions"

export const metadata: Metadata = { title: "Équipe" }

async function getEquipe() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  const personIds = members.map((m) => m.personId)
  const persons = await prisma.person.findMany({ where: { id: { in: personIds } } })
  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  return members.map((m) => ({ ...m, person: personsById[m.personId] ?? null }))
}

export default async function EquipePage() {
  const membres = await getEquipe()

  return (
    <BureauDataPage
      title="Équipe"
      description={`${membres.length} membre${membres.length > 1 ? "s" : ""} de l'équipe`}
      addHref="/bureau/equipe/nouveau"
      addLabel="Nouveau membre"
    >
      {membres.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
            <IconUsers className="size-5 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Aucun membre enregistré</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Ajoutez un membre via le bouton ci-dessus</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

          {/* ── En-tête
               mobile : [membre | •]
               sm     : [membre | poste | ordre | •]
               lg     : [membre | poste | description | ordre | •]  ── */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_auto_auto] lg:grid-cols-[2fr_1fr_2fr_auto_auto]">
            <span>Membre</span>
            <span className="hidden sm:block">Poste</span>
            <span className="hidden lg:block">Description</span>
            <span className="hidden sm:block text-center">Ordre</span>
            <span />
          </div>

          {/* ── Lignes ── */}
          <div className="divide-y divide-border/60">
            {membres.map((m) => {
              const p = m.person
              const posteLabel = getPosteLabel(m.poste)

              return (
                <div
                  key={m.id}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_1fr_auto_auto] lg:grid-cols-[2fr_1fr_2fr_auto_auto]"
                >
                  {/* Colonne 1 — photo + nom + sous-textes */}
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="shrink-0">
                      <CloudinaryImage
                        imageId={m.imageId}
                        alt={p ? `${p.firstName} ${p.lastName}` : "Membre"}
                        thumbSize={36}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {p ? `${p.firstName} ${p.lastName}` : "—"}
                      </p>
                      {/* Poste — mobile uniquement */}
                      {posteLabel && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground sm:hidden">
                          {posteLabel}
                        </p>
                      )}
                      {/* Description — mobile + sm */}
                      {m.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground lg:hidden">
                          {m.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Colonne 2 — Poste (sm+) */}
                  <div className="hidden sm:block min-w-0">
                    {posteLabel ? (
                      <span className="truncate text-sm text-foreground">{posteLabel}</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>

                  {/* Colonne 3 — Description (lg+) */}
                  <p className="hidden lg:block truncate text-sm text-muted-foreground">
                    {m.description ?? <span className="text-muted-foreground/40">—</span>}
                  </p>

                  {/* Colonne 4 — Ordre (sm+) */}
                  <div className="hidden sm:block w-8 text-center tabular-nums text-sm text-muted-foreground">
                    {m.order}
                  </div>

                  {/* Colonne 5 — Actions */}
                  <RowActions
                    editHref={`/bureau/equipe/${m.id}/modifier`}
                    onDelete={deleteMembreEquipe.bind(null, m.id)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </BureauDataPage>
  )
}
