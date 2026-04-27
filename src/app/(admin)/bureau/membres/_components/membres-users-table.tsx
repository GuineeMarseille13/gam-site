import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconBriefcase, IconCircleFilled } from "@tabler/icons-react"

export interface MembresUserRow {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
  banned?: boolean | null
  associationRoleLabel?: string | null
}

interface RoleStyleFn {
  (role: string | null | undefined): { label: string; dot: string; badge: string }
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

interface MembresUsersTableProps {
  users: MembresUserRow[]
  sessionUserId: string | null | undefined
  roleStyle: RoleStyleFn
}

/** Table des comptes Better Auth (admin / bureau / administration). */
export function MembresUsersTable({ users, sessionUserId, roleStyle }: MembresUsersTableProps) {
  if (users.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr]">
        <span>Utilisateur</span>
        <span className="hidden sm:block">Rôle</span>
        <span className="hidden lg:block">Poste dans le bureau</span>
      </div>

      <div className="divide-y divide-border/60">
        {users.map((user) => {
          const isSelf = sessionUserId === user.id
          const style = roleStyle(user.role)
          const banned = user.banned === true
          const roleGam = user.associationRoleLabel ?? null

          return (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr]"
            >
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
                  {roleGam && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-muted-foreground sm:hidden">
                      <IconBriefcase className="size-3 shrink-0" />
                      {roleGam}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden sm:block">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
                >
                  <IconCircleFilled className={`size-1.5 ${style.dot}`} />
                  {style.label}
                </span>
                {roleGam && (
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground lg:hidden">
                    <IconBriefcase className="size-3 shrink-0" />
                    {roleGam}
                  </p>
                )}
              </div>

              <div className="hidden lg:block">
                {roleGam ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40">
                    <IconBriefcase className="size-3 shrink-0" />
                    {roleGam}
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
}
