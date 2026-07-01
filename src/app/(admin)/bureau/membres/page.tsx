import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDashboardPermissions } from "@/config/dashboard-permissions"
import { BureauContent } from "@/components/bureau/bureau-content"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { parseAdminPage } from "@/app/(admin)/_shared/_lib/admin-pagination"
import {
  IconHandStop,
  IconBriefcase,
  IconShieldCheck,
  IconBuildingCommunity,
} from "@tabler/icons-react"
import {
  getMembresHasAnyData,
  getMembresStatsCounts,
  listBenevolesPaginated,
  listComptesPaginated,
  listTeamMembersPaginated,
} from "./_services/membres-list.service"
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
import { MembresTablePagination } from "./_components/membres-table-pagination"

export const metadata: Metadata = { title: "Membres" }

const ADMIN_ROLES = ["SUPER-ADMIN"] as const
const ADMINISTRATION_ROLES = [
  "ADMIN-PERMADMIN",
  "PERMADMIN",
  "INVITE-PERMADMIN",
] as const

export default async function MembresPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const roleFilter = getFirstSearchParam(rawParams.role)
  const statutFilter = getFirstSearchParam(rawParams.statut)

  const page = parseAdminPage(getFirstSearchParam(rawParams.page))
  const pageAdmin = parseAdminPage(getFirstSearchParam(rawParams.pageAdmin))
  const pageBureau = parseAdminPage(getFirstSearchParam(rawParams.pageBureau))
  const pageAdministration = parseAdminPage(
    getFirstSearchParam(rawParams.pageAdministration),
  )
  const pageBenevoles = parseAdminPage(getFirstSearchParam(rawParams.pageBenevoles))

  const session = await auth.api.getSession({ headers: await headers() })
  const permissions = getDashboardPermissions(session?.user.role)

  const isAllRoles = !roleFilter
  const isFilterBureauEquipe = roleFilter === "BUREAU"
  const isFilterAdministration = roleFilter === "ADMIN-PERMADMIN"
  const isFilterAdmin = roleFilter === "SUPER-ADMIN"
  const isFilterBenevole = roleFilter === "benevoles"
  const isGenericRoleFilter = isMembresGenericAccountRoleFilter(roleFilter)
  const genericRoleLabel = roleFilter ? getMembresAccountRoleLabel(roleFilter) : null

  const showComptesEtEquipe =
    permissions.canAccessAdminMembres && !isFilterBenevole
  const showBenevoles =
    permissions.canAccessAdminBenevoles && (isAllRoles || isFilterBenevole)
  const showEquipeSections =
    permissions.canAccessAdminEquipe && (isFilterBureauEquipe || isAllRoles)

  const [stats, hasAnyData] = await Promise.all([
    showComptesEtEquipe && isAllRoles ? getMembresStatsCounts() : null,
    getMembresHasAnyData(),
  ])

  const comptesQuery = { statut: statutFilter }

  const [
    adminUsersResult,
    administrationUsersResult,
    usersAdminDashboardResult,
    usersAdministrationDashboardResult,
    genericRoleUsersResult,
    teamMembersAllResult,
    teamMembersFilteredResult,
    benevolesResult,
  ] = await Promise.all([
    showComptesEtEquipe && isAllRoles
      ? listComptesPaginated({ ...comptesQuery, roles: ADMIN_ROLES, page: pageAdmin })
      : null,
    showComptesEtEquipe && isAllRoles
      ? listComptesPaginated({
          ...comptesQuery,
          roles: ADMINISTRATION_ROLES,
          page: pageAdministration,
        })
      : null,
    showComptesEtEquipe && isFilterAdmin
      ? listComptesPaginated({ ...comptesQuery, roles: ADMIN_ROLES, page })
      : null,
    showComptesEtEquipe && isFilterAdministration
      ? listComptesPaginated({
          ...comptesQuery,
          roles: ADMINISTRATION_ROLES,
          page,
        })
      : null,
    showComptesEtEquipe && isGenericRoleFilter && roleFilter
      ? listComptesPaginated({ ...comptesQuery, roles: [roleFilter], page })
      : null,
    showComptesEtEquipe && showEquipeSections && isAllRoles
      ? listTeamMembersPaginated(pageBureau)
      : null,
    showComptesEtEquipe && showEquipeSections && isFilterBureauEquipe
      ? listTeamMembersPaginated(page)
      : null,
    showBenevoles
      ? listBenevolesPaginated(isAllRoles ? pageBenevoles : page)
      : null,
  ])

  const roleStyle = getMembresRoleStyle

  const statsItems =
    stats && isAllRoles && showComptesEtEquipe
      ? [
          { label: "Total comptes", count: stats.total },
          { label: "Super administrateurs", count: stats.superAdmin },
          { label: "Comptes Bureau", count: stats.bureau },
          { label: "Permanence", count: stats.administration },
          { label: "Membres équipe", count: stats.teamMembers },
        ]
      : []

  return (
    <BureauContent
      title="Membres"
      description="Vue d'ensemble des comptes et des bénévoles"
    >
      <div className="flex flex-col gap-6">
        {hasAnyData && (
          <UserFilters
            canFilterBenevoles={permissions.canAccessAdminBenevoles}
            canFilterEquipe={permissions.canAccessAdminEquipe}
          />
        )}

        {statsItems.length > 0 && <MembresStatsCards items={statsItems} />}

        {showComptesEtEquipe && (
          <>
            {showEquipeSections && isFilterBureauEquipe && teamMembersFilteredResult && (
              <MembresSection
                title="Membres du bureau"
                description={`Équipe dirigeante enregistrée sur le site (${teamMembersFilteredResult.total})`}
                emptyIcon={IconBriefcase}
                emptyTitle="Aucun membre du bureau"
                emptyDescription="Aucun membre du bureau enregistré dans l'équipe."
                isEmpty={teamMembersFilteredResult.data.length === 0}
              >
                <MembresTeamTable
                  rows={teamMembersFilteredResult.data}
                  sessionUserId={session?.user.id}
                  roleStyle={roleStyle}
                />
                <MembresTablePagination
                  total={teamMembersFilteredResult.total}
                  page={teamMembersFilteredResult.page}
                  searchParams={rawParams}
                />
              </MembresSection>
            )}

            {isAllRoles && adminUsersResult && administrationUsersResult && (
              <div className="flex flex-col gap-8">
                <MembresSection
                  title="Administrateurs"
                  description={`Comptes avec accès administrateur (${adminUsersResult.total})`}
                  emptyIcon={IconShieldCheck}
                  emptyTitle="Aucun administrateur"
                  emptyDescription="Aucun compte avec le rôle administrateur n'est enregistré."
                  isEmpty={adminUsersResult.data.length === 0}
                >
                  <MembresUsersTable
                    users={adminUsersResult.data}
                    sessionUserId={session?.user.id}
                    roleStyle={roleStyle}
                  />
                  <MembresTablePagination
                    total={adminUsersResult.total}
                    page={adminUsersResult.page}
                    searchParams={rawParams}
                    pageParam="pageAdmin"
                  />
                </MembresSection>

                {showEquipeSections && teamMembersAllResult && (
                  <MembresSection
                    title="Membres du bureau"
                    description={`Membres de l'équipe dirigeante (équipe site) (${teamMembersAllResult.total})`}
                    emptyIcon={IconBriefcase}
                    emptyTitle="Aucun membre du bureau"
                    emptyDescription="Aucun membre du bureau enregistré dans l'équipe."
                    isEmpty={teamMembersAllResult.data.length === 0}
                  >
                    <MembresTeamTable
                      rows={teamMembersAllResult.data}
                      sessionUserId={session?.user.id}
                      roleStyle={roleStyle}
                    />
                    <MembresTablePagination
                      total={teamMembersAllResult.total}
                      page={teamMembersAllResult.page}
                      searchParams={rawParams}
                      pageParam="pageBureau"
                    />
                  </MembresSection>
                )}

                <MembresSection
                  title="Administration"
                  description={`Comptes espace administration (${administrationUsersResult.total})`}
                  emptyIcon={IconBuildingCommunity}
                  emptyTitle="Aucun compte administration"
                  emptyDescription="Aucun compte avec le rôle administration n'est enregistré."
                  isEmpty={administrationUsersResult.data.length === 0}
                >
                  <MembresUsersTable
                    users={administrationUsersResult.data}
                    sessionUserId={session?.user.id}
                    roleStyle={roleStyle}
                  />
                  <MembresTablePagination
                    total={administrationUsersResult.total}
                    page={administrationUsersResult.page}
                    searchParams={rawParams}
                    pageParam="pageAdministration"
                  />
                </MembresSection>
              </div>
            )}

            {!isAllRoles && !isFilterBureauEquipe && isFilterAdmin && usersAdminDashboardResult && (
              <MembresSection
                title="Administrateurs"
                description={`Comptes avec accès administrateur au dashboard bureau (${usersAdminDashboardResult.total})`}
                emptyIcon={IconShieldCheck}
                emptyTitle="Aucun administrateur"
                emptyDescription="Aucun compte avec le rôle administrateur ne correspond aux filtres."
                isEmpty={usersAdminDashboardResult.data.length === 0}
              >
                <MembresUsersTable
                  users={usersAdminDashboardResult.data}
                  sessionUserId={session?.user.id}
                  roleStyle={roleStyle}
                />
                <MembresTablePagination
                  total={usersAdminDashboardResult.total}
                  page={usersAdminDashboardResult.page}
                  searchParams={rawParams}
                />
              </MembresSection>
            )}

            {!isAllRoles &&
              !isFilterBureauEquipe &&
              isFilterAdministration &&
              usersAdministrationDashboardResult && (
                <MembresSection
                  title="Administration"
                  description={`Comptes avec accès au dashboard Administration (${usersAdministrationDashboardResult.total})`}
                  emptyIcon={IconBuildingCommunity}
                  emptyTitle="Aucun accès Administration"
                  emptyDescription="Aucun compte avec le rôle « administration » ne correspond aux filtres."
                  isEmpty={usersAdministrationDashboardResult.data.length === 0}
                >
                  <MembresUsersTable
                    users={usersAdministrationDashboardResult.data}
                    sessionUserId={session?.user.id}
                    roleStyle={roleStyle}
                  />
                  <MembresTablePagination
                    total={usersAdministrationDashboardResult.total}
                    page={usersAdministrationDashboardResult.page}
                    searchParams={rawParams}
                  />
                </MembresSection>
              )}

            {isGenericRoleFilter &&
              genericRoleLabel &&
              genericRoleUsersResult && (
                <MembresSection
                  title={genericRoleLabel}
                  description={`Comptes avec le rôle « ${genericRoleLabel} » (${genericRoleUsersResult.total})`}
                  emptyIcon={IconShieldCheck}
                  emptyTitle="Aucun compte"
                  emptyDescription="Aucun compte ne correspond à ce rôle et à ces filtres."
                  isEmpty={genericRoleUsersResult.data.length === 0}
                >
                  <MembresUsersTable
                    users={genericRoleUsersResult.data}
                    sessionUserId={session?.user.id}
                    roleStyle={roleStyle}
                  />
                  <MembresTablePagination
                    total={genericRoleUsersResult.total}
                    page={genericRoleUsersResult.page}
                    searchParams={rawParams}
                  />
                </MembresSection>
              )}
          </>
        )}

        {showBenevoles && benevolesResult && (
          <MembresSection
            title="Bénévoles"
            description={`Contacts bénévoles de l'association (${benevolesResult.total})`}
            emptyIcon={IconHandStop}
            emptyTitle="Aucun bénévole"
            emptyDescription="Aucun bénévole enregistré."
            isEmpty={benevolesResult.data.length === 0}
          >
            <MembresBenevolesTable rows={benevolesResult.data} />
            <MembresTablePagination
              total={benevolesResult.total}
              page={benevolesResult.page}
              searchParams={rawParams}
              pageParam={isAllRoles ? "pageBenevoles" : "page"}
            />
          </MembresSection>
        )}
      </div>
    </BureauContent>
  )
}

function MembresSection({
  title,
  description,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  isEmpty,
  children,
}: {
  title: string
  description: string
  emptyIcon: typeof IconBriefcase
  emptyTitle: string
  emptyDescription: string
  isEmpty: boolean
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {isEmpty ? (
        <MembresEmptyZone
          Icon={EmptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        children
      )}
    </section>
  )
}
