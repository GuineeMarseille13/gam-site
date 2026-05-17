import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconMail } from "@tabler/icons-react"
import {
  MEMBRES_TABLE_HEADER,
  MEMBRES_TABLE_ROW,
  MEMBRES_TABLE_WRAPPER,
} from "./membres-list-layout"
import type { MembresRoleStyle } from "./membres-role-styles"
import {
  MembresDashboardRoleBadge,
  MembresMobileRolePoste,
  MembresPosteBadge,
} from "./membres-table-primitives"

export interface MembreBureauRow {
  id: string
  personId: string
  userId: string | null
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  posteLabel: string | null
  image: string | null
  dashboardRole: string | null
  banned: boolean
}

interface MembresTeamTableProps {
  rows: MembreBureauRow[]
  sessionUserId: string | null | undefined
  roleStyle: (role: string | null | undefined) => MembresRoleStyle
}

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

/**
 * Membres du bureau = lignes team_members avec personne + compte d'accès si présent.
 */
export function MembresTeamTable({
  rows,
  sessionUserId,
  roleStyle,
}: MembresTeamTableProps) {
  if (rows.length === 0) return null

  return (
    <div className={MEMBRES_TABLE_WRAPPER}>
      <div className="min-w-0">
        <div className={MEMBRES_TABLE_HEADER}>
          <span>Membre</span>
          <span className="hidden sm:block">Rôle</span>
          <span className="hidden sm:block">Poste dans le bureau</span>
        </div>

        <div className="divide-y divide-border/60">
          {rows.map((row) => {
            const fullName = `${row.firstName} ${row.lastName}`
            const isSelf = row.userId != null && sessionUserId === row.userId
            const style = roleStyle(row.dashboardRole)
            const posteLabel = row.posteLabel

            return (
              <div key={row.id} className={MEMBRES_TABLE_ROW}>
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="relative size-9 shrink-0">
                    <Avatar className="size-9 ring-2 ring-border/40">
                      <AvatarImage
                        src={row.image ?? ""}
                        alt={fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-xs font-bold text-blue-800 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300">
                        {initials(row.firstName, row.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background shadow-sm ${row.banned ? "bg-rose-400" : "bg-emerald-400"}`}
                      title={
                        row.userId
                          ? row.banned
                            ? "Compte banni"
                            : "Compte actif"
                          : "Pas de compte d'accès"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {fullName}
                      </p>
                      {isSelf && (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                          VOUS
                        </span>
                      )}
                    </div>
                    {row.email && (
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <IconMail className="size-3 shrink-0" />
                        {row.email}
                      </p>
                    )}
                    <MembresMobileRolePoste
                      roleStyle={row.dashboardRole ? style : null}
                      showRole={Boolean(row.dashboardRole)}
                      posteLabel={posteLabel}
                    />
                  </div>
                </div>

                <div className="hidden min-w-0 sm:block">
                  {row.dashboardRole ? (
                    <MembresDashboardRoleBadge style={style} />
                  ) : (
                    <span className="text-xs text-muted-foreground/60">Pas de compte</span>
                  )}
                </div>

                <div className="hidden min-w-0 sm:block">
                  {posteLabel ? (
                    <MembresPosteBadge label={posteLabel} />
                  ) : (
                    <span className="text-xs text-muted-foreground/40">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
