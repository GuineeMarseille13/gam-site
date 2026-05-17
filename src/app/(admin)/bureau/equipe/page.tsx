import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { IconCircleFilled, IconUsers } from "@tabler/icons-react"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { deleteMembreEquipe } from "./_actions/actions"
import { EquipeFilters } from "./_components/equipe-filters"
import { getDashboardAccessRoleLabel } from "@/app/(admin)/bureau/acces/_components/dashboard-access-role-label"
import { EquipeRowActions } from "./_components/equipe-row-actions"

export const metadata: Metadata = { title: "Équipe" }

const EQUIPE_LIST_GRID =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_15.5rem]"

/** Rôle d’accès dashboard (User.role), pas le poste dans le bureau. */
const DASHBOARD_ROLE_BADGE: Record<string, { label: string; dot: string; badge: string }> = {
  "SUPER-ADMIN": {
    label: "Super administrateur",
    dot: "text-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40",
  },
  BUREAU: {
    label: "Bureau",
    dot: "text-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40",
  },
  "INVITE-BUREAU": {
    label: "Invité bureau",
    dot: "text-violet-500",
    badge: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:ring-violet-800/40",
  },
}

function DashboardRoleBadge({ role }: { role: string | null }) {
  if (!role) {
    return <span className="text-xs text-muted-foreground/60">Pas de compte</span>
  }

  const style = DASHBOARD_ROLE_BADGE[role]
  const label = style?.label ?? getDashboardAccessRoleLabel(role)
  const dot = style?.dot ?? "text-muted-foreground"
  const badge =
    style?.badge ??
    "bg-muted text-muted-foreground ring-border dark:bg-muted/40"

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badge}`}>
      <IconCircleFilled className={`size-1.5 ${dot}`} />
      {label}
    </span>
  )
}

function PosteBadge({ labelFr }: { labelFr: string | null }) {
  if (!labelFr) return <span className="text-xs text-muted-foreground/40">—</span>
  return (
    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40">
      {labelFr}
    </span>
  )
}

// ── Données ────────────────────────────────────────────────────────────────────

async function getEquipe() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  if (members.length === 0) return []

  const personIds = members.map((m) => m.personId)
  const persons   = await prisma.person.findMany({
    where: { id: { in: personIds } },
    include: { poste: true },
  })

  const userIds = persons.flatMap((p) => (p.userId ? [p.userId] : []))
  const users   = userIds.length > 0
    ? await prisma.user.findMany({ where: { id: { in: userIds } } })
    : []

  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  const usersById   = Object.fromEntries(users.map((u) => [u.id, u]))

  return members.map((m) => {
    const person = personsById[m.personId] ?? null
    const user   = person?.userId ? (usersById[person.userId] ?? null) : null
    const posteLabel = person?.poste?.labelFr ?? null

    return {
      ...m,
      person,
      userId: person?.userId ?? null,
      role:   user?.role ?? null,
      banned: (user as { banned?: boolean } | null)?.banned ?? false,
      posteLabel,
    }
  })
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function EquipePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; visibilite?: string }>
}) {
  const { role: roleFilter, visibilite: visibiliteFilter } = await searchParams

  const allMembres = await getEquipe()

  const membres = allMembres.filter((m) => {
    if (roleFilter && m.role !== roleFilter) return false
    if (visibiliteFilter === "visible" && !m.showOnSite)  return false
    if (visibiliteFilter === "masque"  &&  m.showOnSite)  return false
    return true
  })

  const hasFilters = roleFilter || visibiliteFilter

  return (
    <BureauContent
      title="Équipe"
      description={`${allMembres.length} membre${allMembres.length > 1 ? "s" : ""} de l'équipe`}
      addHref="/bureau/equipe/nouveau"
      addLabel="Nouveau membre"
    >
      {/* Filtres */}
      {allMembres.length > 0 && <EquipeFilters />}

      {membres.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
            <IconUsers className="size-5 text-muted-foreground/50" />
          </div>
          <div>
            {allMembres.length === 0 ? (
              <>
                <p className="text-sm font-semibold text-foreground">Aucun membre enregistré</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Ajoutez un membre via le bouton ci-dessus</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">Aucun résultat</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Aucun membre ne correspond aux filtres sélectionnés</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

          {/* ── En-tête
               mobile : [Membre | •]
               sm     : [Membre | Poste | Rôle | •]
               lg     : [Membre | Poste | Rôle | Description | Actions]  ── */}
          <div className={`${EQUIPE_LIST_GRID} border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground`}>
            <span>Membre</span>
            <span className="hidden sm:block">Poste</span>
            <span className="hidden sm:block">Rôle</span>
            <span className="hidden lg:block">Description</span>
            <span className="hidden text-right lg:block">Actions</span>
          </div>

          {/* ── Lignes ── */}
          <div className="divide-y divide-border/60">
            {membres.map((m) => {
              const p = m.person

              return (
                <div
                  key={m.id}
                  className={`group ${EQUIPE_LIST_GRID} px-5 py-3.5 transition-colors hover:bg-muted/20`}
                >
                  {/* Colonne 1 — photo + nom + sous-textes */}
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="relative size-9 shrink-0">
                      <CloudinaryImage
                        imageId={m.imageId}
                        alt={p ? `${p.firstName} ${p.lastName}` : "Membre"}
                        thumbSize={36}
                        className="rounded-full ring-2 ring-border/40"
                      />
                      <span
                        className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background shadow-sm ${m.banned ? "bg-rose-400" : m.showOnSite ? "bg-emerald-400" : "bg-muted-foreground/30"}`}
                        title={m.banned ? "Compte banni" : m.showOnSite ? "Visible sur le site" : "Masqué du site"}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {p ? `${p.firstName} ${p.lastName}` : "—"}
                      </p>
                      {/* Rôle — mobile uniquement */}
                      {m.posteLabel && (
                        <div className="mt-0.5 sm:hidden">
                          <PosteBadge labelFr={m.posteLabel} />
                        </div>
                      )}
                      <div className="mt-0.5 sm:hidden">
                        <DashboardRoleBadge role={m.role} />
                      </div>
                      {/* Description — mobile + sm */}
                      {m.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground lg:hidden">
                          {m.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Colonne 2 — Poste (sm+) */}
                  <div className="hidden sm:block">
                    <PosteBadge labelFr={m.posteLabel} />
                  </div>

                  <div className="hidden sm:block">
                    <DashboardRoleBadge role={m.role} />
                  </div>

                  {/* Colonne 4 — Description (lg+) */}
                  <p className="hidden lg:block truncate text-sm text-muted-foreground">
                    {m.description ?? <span className="text-muted-foreground/40">—</span>}
                  </p>

                  {/* Colonne Actions — largeur fixe, alignée à droite (lg+) */}
                  <div className="flex min-w-0 justify-end">
                    <EquipeRowActions
                    memberId={m.id}
                    editHref={`/bureau/equipe/${m.id}/modifier`}
                    imageId={m.imageId}
                    posteLabel={m.posteLabel}
                    role={m.role}
                    description={m.description}
                    order={m.order}
                    showOnSite={m.showOnSite}
                    banned={m.banned}
                    person={m.person}
                    onDelete={deleteMembreEquipe.bind(null, m.id)}
                  />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pied de tableau — résumé si filtres actifs */}
          {hasFilters && (
            <div className="border-t bg-muted/20 px-5 py-2.5 text-xs text-muted-foreground">
              {membres.length} résultat{membres.length > 1 ? "s" : ""} sur {allMembres.length} membres
            </div>
          )}
        </div>
      )}
    </BureauContent>
  )
}
