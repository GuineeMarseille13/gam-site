import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export interface MembresUserRow {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
  banned?: boolean | null
  posteLabel?: string | null
}

interface MembresUsersTableProps {
  users: MembresUserRow[]
  sessionUserId: string | null | undefined
  roleStyle: (role: string | null | undefined) => MembresRoleStyle
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/** Table des comptes Better Auth (admin / bureau / administration). */
export function MembresUsersTable({
  users,
  sessionUserId,
  roleStyle,
}: MembresUsersTableProps) {
  if (users.length === 0) return null

  return (
    <div className={MEMBRES_TABLE_WRAPPER}>
      <div className="min-w-0">
        <div className={MEMBRES_TABLE_HEADER}>
          <span>Utilisateur</span>
          <span className="hidden sm:block">Rôle</span>
          <span className="hidden sm:block">Poste dans le bureau</span>
        </div>

        <div className="divide-y divide-border/60">
          {users.map((user) => {
            const isSelf = sessionUserId === user.id
            const style = roleStyle(user.role)
            const banned = user.banned === true
            const posteLabel = user.posteLabel ?? null

            return (
              <div key={user.id} className={MEMBRES_TABLE_ROW}>
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="relative size-9 shrink-0">
                    <Avatar className="size-9 ring-2 ring-border/40">
                      <AvatarImage src={user.image ?? ""} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-100 to-amber-200 text-xs font-bold text-amber-800 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300">
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
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      {isSelf && (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                          VOUS
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <MembresMobileRolePoste
                      roleStyle={style}
                      showRole={Boolean(user.role)}
                      posteLabel={posteLabel}
                    />
                  </div>
                </div>

                <div className="hidden min-w-0 sm:block">
                  {user.role ? (
                    <MembresDashboardRoleBadge style={style} />
                  ) : (
                    <span className="text-xs text-muted-foreground/60">—</span>
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
