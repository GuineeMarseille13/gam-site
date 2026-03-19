import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Badge } from "@/components/ui/badge"
import { RowActions } from "@/components/bureau/row-actions"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { IconBuildingStore } from "@tabler/icons-react"
import { deletePartenaire } from "./_actions/actions"

export const metadata: Metadata = { title: "Partenaires" }

async function getPartenaires() {
  return prisma.partner.findMany({ orderBy: { createdAt: "desc" } })
}

export default async function PartenairesPage() {
  const partenaires = await getPartenaires()

  return (
    <BureauDataPage
      title="Partenaires"
      description={`${partenaires.length} partenaire${partenaires.length > 1 ? "s" : ""}`}
      addHref="/bureau/partenaires/nouveau"
      addLabel="Nouveau partenaire"
    >
      {partenaires.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
            <IconBuildingStore className="size-5 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Aucun partenaire enregistré</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Ajoutez un partenaire via le bouton ci-dessus</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

          {/* ── En-tête
               mobile : [partenaire | •]
               sm     : [partenaire | statut | •]
               lg     : [partenaire | site web | description | statut | •]  ── */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_auto_auto] lg:grid-cols-[2fr_1.5fr_2fr_auto_auto]">
            <span>Partenaire</span>
            <span className="hidden lg:block">Site web</span>
            <span className="hidden lg:block">Description</span>
            <span className="hidden sm:block">Statut</span>
            <span />
          </div>

          {/* ── Lignes ── */}
          <div className="divide-y divide-border/60">
            {partenaires.map((p) => (
              <div
                key={p.id}
                className="group grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_auto_auto] lg:grid-cols-[2fr_1.5fr_2fr_auto_auto]"
              >
                {/* Colonne 1 — logo + nom + infos contextuelles */}
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="shrink-0">
                    <CloudinaryImage imageId={p.imageId} alt={p.name} thumbSize={36} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                    {/* Site web — mobile uniquement */}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block truncate text-xs text-blue-600 hover:underline lg:hidden"
                      >
                        {p.url}
                      </a>
                    )}
                    {/* Description — mobile + sm */}
                    {p.description && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground lg:hidden">
                        {p.description}
                      </p>
                    )}
                    {/* Statut — mobile uniquement */}
                    <div className="mt-1 sm:hidden">
                      <Badge
                        variant="secondary"
                        className={p.published ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}
                      >
                        {p.published ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Colonne 2 — Site web (lg+) */}
                <div className="hidden lg:block min-w-0">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-blue-600 hover:underline"
                    >
                      {p.url}
                    </a>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </div>

                {/* Colonne 3 — Description (lg+) */}
                <p className="hidden lg:block truncate text-sm text-muted-foreground">
                  {p.description ?? <span className="text-muted-foreground/40">—</span>}
                </p>

                {/* Colonne 4 — Statut (sm+) */}
                <div className="hidden sm:block">
                  <Badge
                    variant="secondary"
                    className={p.published ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}
                  >
                    {p.published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>

                {/* Colonne 5 — Actions */}
                <RowActions
                  editHref={`/bureau/partenaires/${p.id}/modifier`}
                  onDelete={deletePartenaire.bind(null, p.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </BureauDataPage>
  )
}
