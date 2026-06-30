import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import {
  IconHandStop,
  IconBriefcase,
  IconShieldCheck,
  IconBuildingCommunity,
} from "@tabler/icons-react"
import { listComptes, listBenevoles, listTeamMembersForMembresPage } from "./_actions/actions"
import { UserFilters } from "./_components/user-filters"
import {
  getMembresAccountRoleLabel,
  isMembresGenericAccountRoleFilter,
} from "./_components/membres-filter-config"
import { MembresUsersTable } from "./_components/membres-users-table"
import { MembresTeamTable } from "./_components/membres-team-table"
import { MembresBenevolesTable } from "./_components/membres-benevoles-table"
import { MembresEmptyZone } from "./_components/membres-empty-zone"
import { MembresStatsCards } from "./_components/membres-stats-cards"
import { getMembresRoleStyle } from "./_components/membres-role-styles"

export const metadata: Metadata = { title: "Membres" }

export default async function MembresPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; statut?: string }>
}) {
  const { role: roleFilter, statut: statutFilter } = await searchParams

  const session = await auth.api.getSession({ headers: await headers() })
  const permissions = getDashboardPermissions(session?.user.role)

  const [allComptes, benevoles, teamMembersRows] = await Promise.all([
    listComptes(),
    permissions.canAccessAdminBenevoles ? listBenevoles() : Promise.resolve([]),
    permissions.canAccessAdminMembres ? listTeamMembersForMembresPage() : Promise.resolve([]),
  ])

  const isAllRoles = !roleFilter
  const isFilterBureauEquipe = roleFilter === "BUREAU"
  const isFilterAdministration = roleFilter === "ADMIN-PERMADMIN"
  const isFilterAdmin = roleFilter === "SUPER-ADMIN"
  const isFilterBenevole = roleFilter === "benevoles"
  const isGenericRoleFilter = isMembresGenericAccountRoleFilter(roleFilter)
  const genericRoleLabel = roleFilter ? getMembresAccountRoleLabel(roleFilter) : null

  const comptesAfterStatut = allComptes.filter((u) => {
    const banned = (u as { banned?: boolean }).banned === true
    if (statutFilter === "actif" && banned) return false
    if (statutFilter === "banni" && !banned) return false
    return true
  })

  const adminUsers =
    isAllRoles || roleFilter === "SUPER-ADMIN"
      ? comptesAfterStatut.filter((u) => u.role === "SUPER-ADMIN")
      : []

  const administrationUsers =
    isAllRoles || roleFilter === "ADMIN-PERMADMIN"
      ? comptesAfterStatut.filter((u) =>
          u.role === "ADMIN-PERMADMIN" ||
          u.role === "PERMADMIN" ||
          u.role === "INVITE-PERMADMIN",
        )
      : []

  const usersAdminDashboard = isFilterAdmin
    ? comptesAfterStatut.filter((u) => u.role === "SUPER-ADMIN")
    : []

  const usersAdministrationDashboard = isFilterAdministration
    ? comptesAfterStatut.filter(
        (u) =>
          u.role === "ADMIN-PERMADMIN" ||
          u.role === "PERMADMIN" ||
          u.role === "INVITE-PERMADMIN",
      )
    : []

  const genericRoleUsers = isGenericRoleFilter
    ? comptesAfterStatut.filter((u) => u.role === roleFilter)
    : []

  const showComptesEtEquipe =
    permissions.canAccessAdminMembres && !isFilterBenevole
  const showBenevoles =
    permissions.canAccessAdminBenevoles && (isAllRoles || isFilterBenevole)
  const showEquipeSections =
    permissions.canAccessAdminEquipe && (isFilterBureauEquipe || isAllRoles)

  const showFiltersRow =
    allComptes.length > 0 || benevoles.length > 0 || teamMembersRows.length > 0

  const roleStyle = getMembresRoleStyle

  const statsItems =
    isAllRoles && showComptesEtEquipe && allComptes.length > 0
      ? [
          { label: "Total comptes", count: allComptes.length },
          {
            label: "Super administrateurs",
            count: allComptes.filter((u) => u.role === "SUPER-ADMIN").length,
          },
          {
            label: "Comptes Bureau",
            count: allComptes.filter((u) => u.role === "BUREAU").length,
          },
          {
            label: "Permanence",
            count: allComptes.filter(
              (u) =>
                u.role === "ADMIN-PERMADMIN" ||
                u.role === "PERMADMIN" ||
                u.role === "INVITE-PERMADMIN",
            ).length,
          },
          { label: "Membres équipe", count: teamMembersRows.length },
        ]
      : []

  return (
    <BureauContent
      title="Membres"
      description="Vue d'ensemble des comptes et des bénévoles"
    >
      <div className="flex flex-col gap-6">
        {showFiltersRow && (
          <UserFilters
            canFilterBenevoles={permissions.canAccessAdminBenevoles}
            canFilterEquipe={permissions.canAccessAdminEquipe}
          />
        )}

        {statsItems.length > 0 && <MembresStatsCards items={statsItems} />}

        {showComptesEtEquipe && (
          <>
            {showEquipeSections && isFilterBureauEquipe && (
              <section className="space-y-3">
                <SectionHeading
                  title="Membres du bureau"
                  description={`Équipe dirigeante enregistrée sur le site (${teamMembersRows.length})`}
                />
                {teamMembersRows.length > 0 ? (
                  <MembresTeamTable
                    rows={teamMembersRows}
                    sessionUserId={session?.user.id}
                    roleStyle={roleStyle}
                  />
                ) : (
                  <MembresEmptyZone
                    Icon={IconBriefcase}
                    title="Aucun membre du bureau"
                    description="Aucun membre du bureau enregistré dans l'équipe."
                  />
                )}
              </section>
            )}

            {isAllRoles && (
              <div className="flex flex-col gap-8">
                <section className="space-y-3">
                  <SectionHeading
                    title="Administrateurs"
                    description={`Comptes avec accès administrateur (${adminUsers.length})`}
                  />
                  {adminUsers.length > 0 ? (
                    <MembresUsersTable
                      users={adminUsers}
                      sessionUserId={session?.user.id}
                      roleStyle={roleStyle}
                    />
                  ) : (
                    <MembresEmptyZone
                      Icon={IconShieldCheck}
                      title="Aucun administrateur"
                      description="Aucun compte avec le rôle administrateur n'est enregistré."
                    />
                  )}
                </section>

                {showEquipeSections && (
                  <section className="space-y-3">
                    <SectionHeading
                      title="Membres du bureau"
                      description={`Membres de l'équipe dirigeante (équipe site) (${teamMembersRows.length})`}
                    />
                    {teamMembersRows.length > 0 ? (
                      <MembresTeamTable
                        rows={teamMembersRows}
                        sessionUserId={session?.user.id}
                        roleStyle={roleStyle}
                      />
                    ) : (
                      <MembresEmptyZone
                        Icon={IconBriefcase}
                        title="Aucun membre du bureau"
                        description="Aucun membre du bureau enregistré dans l'équipe."
                      />
                    )}
                  </section>
                )}

                <section className="space-y-3">
                  <SectionHeading
                    title="Administration"
                    description={`Comptes espace administration (${administrationUsers.length})`}
                  />
                  {administrationUsers.length > 0 ? (
                    <MembresUsersTable
                      users={administrationUsers}
                      sessionUserId={session?.user.id}
                      roleStyle={roleStyle}
                    />
                  ) : (
                    <MembresEmptyZone
                      Icon={IconBuildingCommunity}
                      title="Aucun compte administration"
                      description="Aucun compte avec le rôle administration n'est enregistré."
                    />
                  )}
                </section>
              </div>
            )}

            {!isAllRoles && !isFilterBureauEquipe && isFilterAdmin && (
              <section className="space-y-3">
                <SectionHeading
                  title="Administrateurs"
                  description={`Comptes avec accès administrateur au dashboard bureau (${usersAdminDashboard.length})`}
                />
                {usersAdminDashboard.length > 0 ? (
                  <MembresUsersTable
                    users={usersAdminDashboard}
                    sessionUserId={session?.user.id}
                    roleStyle={roleStyle}
                  />
                ) : (
                  <MembresEmptyZone
                    Icon={IconShieldCheck}
                    title="Aucun administrateur"
                    description="Aucun compte avec le rôle administrateur ne correspond aux filtres."
                  />
                )}
              </section>
            )}

            {!isAllRoles && !isFilterBureauEquipe && isFilterAdministration && (
              <section className="space-y-3">
                <SectionHeading
                  title="Administration"
                  description={`Comptes avec accès au dashboard Administration (${usersAdministrationDashboard.length})`}
                />
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
                    description="Aucun compte avec le rôle « administration » ne correspond aux filtres."
                  />
                )}
              </section>
            )}

            {isGenericRoleFilter && genericRoleLabel && (
              <section className="space-y-3">
                <SectionHeading
                  title={genericRoleLabel}
                  description={`Comptes avec le rôle « ${genericRoleLabel} » (${genericRoleUsers.length})`}
                />
                {genericRoleUsers.length > 0 ? (
                  <MembresUsersTable
                    users={genericRoleUsers}
                    sessionUserId={session?.user.id}
                    roleStyle={roleStyle}
                  />
                ) : (
                  <MembresEmptyZone
                    Icon={IconShieldCheck}
                    title="Aucun compte"
                    description="Aucun compte ne correspond à ce rôle et à ces filtres."
                  />
                )}
              </section>
            )}
          </>
        )}

        {showBenevoles && (
          <section className="space-y-3">
            <SectionHeading
              title="Bénévoles"
              description={`Contacts bénévoles de l'association (${benevoles.length})`}
            />
            {benevoles.length === 0 ? (
              <MembresEmptyZone
                Icon={IconHandStop}
                title="Aucun bénévole"
                description="Aucun bénévole enregistré."
              />
            ) : (
              <MembresBenevolesTable rows={benevoles} />
            )}
          </section>
        )}
      </div>
    </BureauContent>
  )
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
