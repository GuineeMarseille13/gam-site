import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconUsers, IconCircleFilled, IconHandStop, IconPhone, IconMail, IconBriefcase } from "@tabler/icons-react"
import { listComptes, listBenevoles } from "./_actions/actions"
import { getPosteLabel } from "../equipe/_components/postes"
import { UserFilters } from "./_components/user-filters"

export const metadata: Metadata = { title: "Membres" }

const ROLE_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  admin:           { label: "Administrateur", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40" },
  bureau:          { label: "Bureau",          dot: "bg-blue-500",  badge: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40" },
  administration:  { label: "Administration",  dot: "bg-sky-500",   badge: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-800/40" },
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default async function MembresPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; statut?: string }>
}) {
  const { role: roleFilter, statut: statutFilter } = await searchParams

  const [session, allComptes, benevoles] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    listComptes(),
    listBenevoles(),
  ])

  const showUsers     = roleFilter !== "benevole"
  const showBenevoles = !roleFilter || roleFilter === "benevole"

  const users = allComptes.filter((u) => {
    const banned = (u as { banned?: boolean }).banned === true
    if (roleFilter && roleFilter !== "benevole" && u.role !== roleFilter) return false
    if (statutFilter === "actif" && banned) return false
    if (statutFilter === "banni" && !banned) return false
    return true
  })

  const roleStyle = (role: string | null | undefined) =>
    ROLE_STYLES[role ?? ""] ?? { label: role ?? "—", dot: "bg-muted-foreground", badge: "bg-muted text-muted-foreground ring-border" }

  return (
    <BureauDataPage
      title="Membres"
      description="Vue d'ensemble des comptes et des bénévoles"
    >
      {/* Filtres */}
      {(allComptes.length > 0 || benevoles.length > 0) && <UserFilters />}

      {/* Stats rapides */}
      {showUsers && allComptes.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Total comptes",   count: allComptes.length },
            { label: "Administrateurs", count: allComptes.filter((u) => u.role === "admin").length },
            { label: "Bureau",          count: allComptes.filter((u) => u.role === "bureau").length },
            { label: "Administration",  count: allComptes.filter((u) => u.role === "administration").length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight">{stat.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Comptes d'accès ────────────────────────────────────────────────── */}
      {showUsers && (
        users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
              <IconUsers className="size-5 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {allComptes.length === 0 ? "Aucun utilisateur" : "Aucun résultat"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {allComptes.length === 0
                  ? "Aucun compte enregistré"
                  : "Aucun utilisateur ne correspond aux filtres sélectionnés"}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

            {/* En-tête colonnes */}
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr]">
              <span>Utilisateur</span>
              <span className="hidden sm:block">Rôle</span>
              <span className="hidden lg:block">Poste</span>
            </div>

            {/* Lignes */}
            <div className="divide-y divide-border/60">
              {users.map((user) => {
                const isSelf  = session?.user.id === user.id
                const style   = roleStyle(user.role)
                const banned  = (user as { banned?: boolean }).banned === true

                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr]"
                  >
                    {/* Colonne 1 — Avatar + nom + email */}
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="relative size-9 shrink-0">
                        <Avatar className="size-9 ring-2 ring-border/40">
                          <AvatarImage src={user.image ?? ""} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 text-xs font-bold dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300">
                            {initials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background shadow-sm ${banned ? "bg-rose-400" : "bg-emerald-400"}`}
                          title={banned ? "Banni" : "Actif"}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                          {isSelf && (
                            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                              VOUS
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        {/* Poste — mobile */}
                        {user.poste && (
                          <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-muted-foreground sm:hidden">
                            <IconBriefcase className="size-3 shrink-0" />
                            {getPosteLabel(user.poste)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Colonne 2 — Rôle (sm+) */}
                    <div className="hidden sm:block">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}>
                        <IconCircleFilled className={`size-1.5 ${style.dot}`} />
                        {style.label}
                      </span>
                      {/* Poste — sm uniquement */}
                      {user.poste && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground lg:hidden">
                          <IconBriefcase className="size-3 shrink-0" />
                          {getPosteLabel(user.poste)}
                        </p>
                      )}
                    </div>

                    {/* Colonne 3 — Poste (lg+) */}
                    <div className="hidden lg:block">
                      {user.poste ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40">
                          <IconBriefcase className="size-3 shrink-0" />
                          {getPosteLabel(user.poste)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/40">—</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      )}

      {/* ── Section Bénévoles ──────────────────────────────────────────────── */}
      {showBenevoles && (
        <div className="space-y-3 pt-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Bénévoles</h2>
            <p className="text-xs text-muted-foreground">
              Contacts bénévoles de l&apos;association ({benevoles.length})
            </p>
          </div>

          {benevoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
                <IconHandStop className="size-5 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Aucun bénévole</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Aucun bénévole enregistré</p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

              {/* En-tête */}
              <div className="grid grid-cols-1 items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr]">
                <span>Bénévole</span>
                <span className="hidden sm:block">Téléphone</span>
                <span className="hidden lg:block">Email</span>
              </div>

              <div className="divide-y divide-border/60">
                {benevoles.map((person) => {
                  const ini = `${person.firstName[0]}${person.lastName[0]}`.toUpperCase()
                  return (
                    <div
                      key={person.id}
                      className="grid grid-cols-1 items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr]"
                    >
                      {/* Colonne 1 — Avatar + nom + sous-textes */}
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className="relative size-9 shrink-0">
                          <Avatar className="size-9 ring-2 ring-border/40">
                            <AvatarImage src={person.image ?? ""} alt={`${person.firstName} ${person.lastName}`} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-violet-100 to-violet-200 text-xs font-bold text-violet-800 dark:from-violet-900/40 dark:to-violet-800/40 dark:text-violet-300">
                              {ini}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background shadow-sm ${person.showOnSite ? "bg-emerald-400" : "bg-muted-foreground/30"}`}
                            title={person.showOnSite ? "Visible sur le site" : "Masqué du site"}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {person.firstName} {person.lastName}
                          </p>
                          {/* Téléphone — mobile */}
                          {person.phone && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                              <IconPhone className="size-3 shrink-0" />{person.phone}
                            </p>
                          )}
                          {/* Email — mobile + sm */}
                          {person.email && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground lg:hidden">
                              <IconMail className="size-3 shrink-0" />{person.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Colonne 2 — Téléphone (sm+) */}
                      <div className="hidden sm:flex items-center gap-1.5 text-sm text-foreground/80">
                        {person.phone
                          ? <><IconPhone className="size-3.5 shrink-0 text-muted-foreground" /><span className="truncate">{person.phone}</span></>
                          : <span className="text-muted-foreground/40">—</span>
                        }
                      </div>

                      {/* Colonne 3 — Email (lg+) */}
                      <div className="hidden lg:flex items-center gap-1.5 text-sm">
                        {person.email
                          ? <><IconMail className="size-3.5 shrink-0 text-muted-foreground" /><span className="truncate text-foreground/80">{person.email}</span></>
                          : <span className="text-muted-foreground/40">—</span>
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </BureauDataPage>
  )
}
