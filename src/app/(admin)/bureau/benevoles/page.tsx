import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconHandStop, IconPhone, IconMail } from "@tabler/icons-react"
import { BenevoleRowActions } from "./_components/benevole-row-actions"

export const metadata: Metadata = { title: "Bénévoles" }

async function getBenevoles() {
  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } })
  if (volunteers.length === 0) return []
  const personIds = volunteers.map((v) => v.personId)
  const persons   = await prisma.person.findMany({
    where:   { id: { in: personIds } },
    include: { address: true },
  })
  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  return volunteers.map((v) => ({ ...v, person: personsById[v.personId] ?? null }))
}

export default async function BenevolesPage() {
  const benevoles = await getBenevoles()

  return (
    <BureauDataPage
      title="Bénévoles"
      description={`${benevoles.length} bénévole${benevoles.length > 1 ? "s" : ""} — Nos héros du quotidien`}
      addHref="/bureau/benevoles/nouveau"
      addLabel="Nouveau bénévole"
    >
      {benevoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
            <IconHandStop className="size-5 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Aucun bénévole</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Ajoutez un bénévole via le bouton ci-dessus</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

          {/* ── En-tête
               mobile : [Bénévole | •]
               sm     : [Bénévole | Téléphone | •]
               lg     : [Bénévole | Téléphone | Email | Actions]  ── */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr_240px]">
            <span>Bénévole</span>
            <span className="hidden sm:block">Téléphone</span>
            <span className="hidden lg:block">Email</span>
            <span className="hidden lg:block text-right">Actions</span>
          </div>

          {/* ── Lignes ── */}
          <div className="divide-y divide-border/60">
            {benevoles.map((b) => {
              const p   = b.person
              const ini = p ? `${p.firstName[0]}${p.lastName[0]}`.toUpperCase() : "?"

              return (
                <div
                  key={b.id}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr_240px]"
                >
                  {/* Colonne 1 — avatar + nom + sous-textes mobiles */}
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="relative size-9 shrink-0">
                      <Avatar className="size-9 ring-2 ring-border/40">
                        <AvatarImage src={p?.image ?? ""} alt={p ? `${p.firstName} ${p.lastName}` : ""} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-violet-100 to-violet-200 text-xs font-bold text-violet-800 dark:from-violet-900/40 dark:to-violet-800/40 dark:text-violet-300">
                          {ini}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background shadow-sm ${p?.showOnSite ? "bg-emerald-400" : "bg-muted-foreground/30"}`}
                        title={p?.showOnSite ? "Visible sur le site" : "Masqué du site"}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {p ? `${p.firstName} ${p.lastName}` : "—"}
                      </p>
                      {/* Téléphone — mobile uniquement */}
                      {p?.phone && (
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                          <IconPhone className="size-3 shrink-0" />{p.phone}
                        </p>
                      )}
                      {/* Email — mobile + sm */}
                      {p?.email && (
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground lg:hidden">
                          <IconMail className="size-3 shrink-0" />{p.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Colonne 2 — Téléphone (sm+) */}
                  <div className="hidden sm:flex items-center gap-1.5 text-sm">
                    <IconPhone className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-foreground/80">{p?.phone ?? "—"}</span>
                  </div>

                  {/* Colonne 3 — Email (lg+) */}
                  <div className="hidden lg:flex items-center gap-1.5 text-sm">
                    {p?.email ? (
                      <>
                        <IconMail className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-foreground/80">{p.email}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>

                  {/* Colonne 4 — Actions */}
                  <BenevoleRowActions volunteerId={b.id} person={b.person} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </BureauDataPage>
  )
}
