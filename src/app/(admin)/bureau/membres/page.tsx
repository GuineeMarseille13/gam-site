import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  IconHandStop,
  IconPhone,
  IconMail,
  IconBriefcase,
  IconShieldCheck,
  IconBuildingCommunity,
} from "@tabler/icons-react"
import { listComptes, listBenevoles, listTeamMembersForMembresPage } from "./_actions/actions"
import { UserFilters } from "./_components/user-filters"
import { MembresUsersTable } from "./_components/membres-users-table"
import { MembresTeamTable } from "./_components/membres-team-table"
import { MembresEmptyZone } from "./_components/membres-empty-zone"

export const metadata: Metadata = { title: "Membres" }

const ROLE_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  admin:           { label: "Administrateur", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40" },
  bureau:          { label: "Bureau",          dot: "bg-blue-500",  badge: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40" },
  administration:  { label: "Administration",  dot: "bg-sky-500",   badge: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-800/40" },
}

export default async function MembresPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; statut?: string }>
}) {
  const { role: roleFilter, statut: statutFilter } = await searchParams

  const [session, allComptes, benevoles, teamMembersRows] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    listComptes(),
    listBenevoles(),
    listTeamMembersForMembresPage(),
  ])

  const isAllRoles = !roleFilter
  const isFilterBureauEquipe = roleFilter === "bureau"
  const isFilterAdministration = roleFilter === "administration"
  const isFilterAdmin = roleFilter === "admin"
  const isFilterBenevole = roleFilter === "benevole"

  /** Comptes après filtre statut (Actif / Banni) — sans filtre rôle métier. */
  const comptesAfterStatut = allComptes.filter((u) => {
    const banned = (u as { banned?: boolean }).banned === true
    if (statutFilter === "actif" && banned) return false
    if (statutFilter === "banni" && !banned) return false
    return true
  })

  const adminUsers =
    isAllRoles || roleFilter === "admin"
      ? comptesAfterStatut.filter((u) => u.role === "admin")
      : []

  const administrationUsers =
    isAllRoles || roleFilter === "administration"
      ? comptesAfterStatut.filter((u) => u.role === "administration")
      : []

  /** Filtre Administrateur : comptes dashboard rôle `admin`. */
  const usersAdminDashboard =
    isFilterAdmin ? comptesAfterStatut.filter((u) => u.role === "admin") : []

  /** Filtre Administration : uniquement accès dashboard `/administration` (rôle `administration`). */
  const usersAdministrationDashboard =
    isFilterAdministration ? comptesAfterStatut.filter((u) => u.role === "administration") : []

  const showComptesEtEquipe = !isFilterBenevole
  const showBenevoles = isAllRoles || isFilterBenevole

  const roleStyle = (role: string | null | undefined) =>
    ROLE_STYLES[role ?? ""] ?? { label: role ?? "—", dot: "bg-muted-foreground", badge: "bg-muted text-muted-foreground ring-border" }

  const showFiltersRow = allComptes.length > 0 || benevoles.length > 0 || teamMembersRows.length > 0

  return (
    <BureauContent
      title="Membres"
      description="Vue d'ensemble des comptes et des bénévoles"
    >
      {showFiltersRow && <UserFilters />}

      {/* Stats — uniquement sur « Tous » */}
      {isAllRoles && showComptesEtEquipe && allComptes.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Total comptes",       count: allComptes.length },
            { label: "Administrateurs",     count: allComptes.filter((u) => u.role === "admin").length },
            { label: "Comptes « Bureau »",  count: allComptes.filter((u) => u.role === "bureau").length },
            { label: "Administration",      count: allComptes.filter((u) => u.role === "administration").length },
            { label: "Membres équipe",      count: teamMembersRows.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight">{stat.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Comptes + équipe (masqué si filtre Bénévole) ───────────────── */}
      {showComptesEtEquipe && (
        <>
          {/* Filtre Bureau = uniquement membres d’équipe (team_members) */}
          {isFilterBureauEquipe && (
            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Membres du bureau</h2>
                <p className="text-xs text-muted-foreground">
                  Équipe dirigeante enregistrée sur le site ({teamMembersRows.length})
                </p>
              </div>
              {teamMembersRows.length > 0 ? (
                <MembresTeamTable rows={teamMembersRows} sessionUserId={session?.user.id} roleStyle={roleStyle} />
              ) : (
                <MembresEmptyZone
                  Icon={IconBriefcase}
                  title="Aucun membre du bureau"
                  description="Aucun membre du bureau enregistré dans l’équipe."
                />
              )}
            </section>
          )}

          {/* Vue « Tous » : sections empilées */}
          {isAllRoles && (
            <div className="space-y-8">
              <section className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Administrateurs</h2>
                  <p className="text-xs text-muted-foreground">
                    Comptes avec accès administrateur ({adminUsers.length})
                  </p>
                </div>
                {adminUsers.length > 0 ? (
                  <MembresUsersTable users={adminUsers} sessionUserId={session?.user.id} roleStyle={roleStyle} />
                ) : (
                  <MembresEmptyZone
                    Icon={IconShieldCheck}
                    title="Aucun administrateur"
                    description="Aucun compte avec le rôle administrateur n’est enregistré."
                  />
                )}
              </section>

              <section className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Membres du bureau</h2>
                  <p className="text-xs text-muted-foreground">
                    Membres de l’équipe dirigeante (équipe site) ({teamMembersRows.length})
                  </p>
                </div>
                {teamMembersRows.length > 0 ? (
                  <MembresTeamTable rows={teamMembersRows} sessionUserId={session?.user.id} roleStyle={roleStyle} />
                ) : (
                  <MembresEmptyZone
                    Icon={IconBriefcase}
                    title="Aucun membre du bureau"
                    description="Aucun membre du bureau enregistré dans l’équipe."
                  />
                )}
              </section>

              <section className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Administration</h2>
                  <p className="text-xs text-muted-foreground">
                    Comptes espace administration ({administrationUsers.length})
                  </p>
                </div>
                {administrationUsers.length > 0 ? (
                  <MembresUsersTable users={administrationUsers} sessionUserId={session?.user.id} roleStyle={roleStyle} />
                ) : (
                  <MembresEmptyZone
                    Icon={IconBuildingCommunity}
                    title="Aucun compte administration"
                    description="Aucun compte avec le rôle administration n’est enregistré."
                  />
                )}
              </section>
            </div>
          )}

          {/* Filtre Administrateur : section dédiée */}
          {!isAllRoles && !isFilterBureauEquipe && isFilterAdmin && (
            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Administrateurs</h2>
                <p className="text-xs text-muted-foreground">
                  Comptes avec accès administrateur au dashboard bureau ({usersAdminDashboard.length})
                </p>
              </div>
              {usersAdminDashboard.length > 0 ? (
                <MembresUsersTable users={usersAdminDashboard} sessionUserId={session?.user.id} roleStyle={roleStyle} />
              ) : (
                <MembresEmptyZone
                  Icon={IconShieldCheck}
                  title="Aucun administrateur"
                  description="Aucun compte avec le rôle administrateur ne correspond aux filtres."
                />
              )}
            </section>
          )}

          {/* Filtre Administration : uniquement dashboard `/administration` */}
          {!isAllRoles && !isFilterBureauEquipe && isFilterAdministration && (
            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Administration</h2>
                <p className="text-xs text-muted-foreground">
                  Comptes avec accès au dashboard Administration ({usersAdministrationDashboard.length})
                </p>
              </div>
              {usersAdministrationDashboard.length > 0 ? (
                <MembresUsersTable
                  users={usersAdministrationDashboard}
                  sessionUserId={session?.user.id}
                  roleStyle={roleStyle}
                />
              ) : (
                <MembresEmptyZone
                  Icon={IconBuildingCommunity}
                  title="Aucun accès Administration"
                  description="Aucun compte avec le rôle « administration » (dashboard Administration) ne correspond aux filtres."
                />
              )}
            </section>
          )}
        </>
      )}

      {/* ── Bénévoles ───────────────────────────────────────────────────── */}
      {showBenevoles && (
        <div className="space-y-3 pt-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Bénévoles</h2>
            <p className="text-xs text-muted-foreground">
              Contacts bénévoles de l&apos;association ({benevoles.length})
            </p>
          </div>

          {benevoles.length === 0 ? (
            <MembresEmptyZone
              Icon={IconHandStop}
              title="Aucun bénévole"
              description="Aucun bénévole enregistré."
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
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
                          {person.phone && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                              <IconPhone className="size-3 shrink-0" />{person.phone}
                            </p>
                          )}
                          {person.email && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground lg:hidden">
                              <IconMail className="size-3 shrink-0" />{person.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 text-sm text-foreground/80">
                        {person.phone
                          ? <><IconPhone className="size-3.5 shrink-0 text-muted-foreground" /><span className="truncate">{person.phone}</span></>
                          : <span className="text-muted-foreground/40">—</span>
                        }
                      </div>

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
    </BureauContent>
  )
}
