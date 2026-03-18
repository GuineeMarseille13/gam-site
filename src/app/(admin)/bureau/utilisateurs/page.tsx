import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconPlus, IconUsers, IconCircleFilled } from "@tabler/icons-react"
import { listUsers } from "./_actions/actions"
import { UserActions } from "./_components/user-actions"
import { ROLES } from "./_components/roles"
import { UserFilters } from "./_components/user-filters"

export const metadata: Metadata = { title: "Utilisateurs" }

const ROLE_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  admin:    { label: "Administrateur", dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40" },
  bureau:   { label: "Bureau",         dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40" },
  benevole: { label: "Bénévole",       dot: "bg-violet-500",  badge: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:ring-violet-800/40" },
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default async function UtilisateursPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; statut?: string }>
}) {
  const { role: roleFilter, statut: statutFilter } = await searchParams

  const [session, allUsers] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    listUsers(),
  ])

  const users = allUsers.filter((u) => {
    const banned = (u as { banned?: boolean }).banned === true
    if (roleFilter && u.role !== roleFilter) return false
    if (statutFilter === "actif" && banned) return false
    if (statutFilter === "banni" && !banned) return false
    return true
  })

  const roleStyle = (role: string | null | undefined) =>
    ROLE_STYLES[role ?? ""] ?? { label: role ?? "—", dot: "bg-muted-foreground", badge: "bg-muted text-muted-foreground ring-border" }

  return (
    <BureauDataPage
      title="Utilisateurs"
      description="Gérez les comptes et les accès au dashboard"
      actions={
        <Button asChild size="sm" className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20">
          <Link href="/bureau/utilisateurs/nouveau">
            <IconPlus className="size-4" />
            <span className="hidden sm:inline">Nouvel utilisateur</span>
            <span className="sm:hidden">Nouveau</span>
          </Link>
        </Button>
      }
    >
      {/* Filtres */}
      {allUsers.length > 0 && <UserFilters />}

      {/* Stats rapides */}
      {allUsers.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", count: allUsers.length, color: "text-foreground", bg: "bg-muted/50" },
            ...ROLES.map((r) => ({
              label: r.label,
              count: allUsers.filter((u) => u.role === r.value).length,
              color: ROLE_STYLES[r.value]?.badge ?? "",
              bg: ROLE_STYLES[r.value]?.badge ?? "",
            })),
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight">{stat.count}</p>
            </div>
          ))}
        </div>
      )}

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed bg-muted/20 py-24 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60">
            <IconUsers className="size-7 text-muted-foreground/50" />
          </div>
          <div>
            {allUsers.length === 0 ? (
              <>
                <p className="font-semibold text-foreground">Aucun utilisateur</p>
                <p className="mt-1 text-sm text-muted-foreground">Créez le premier compte administrateur</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground">Aucun résultat</p>
                <p className="mt-1 text-sm text-muted-foreground">Aucun utilisateur ne correspond aux filtres sélectionnés</p>
              </>
            )}
          </div>
          {allUsers.length === 0 && (
            <Button asChild size="sm" className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/bureau/utilisateurs/nouveau">
                <IconPlus className="size-4" /> Créer un utilisateur
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

          {/* En-tête colonnes */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_1fr_auto]">
            <span>Utilisateur</span>
            <span className="hidden sm:block">Rôle</span>
            <span className="hidden sm:block">Statut</span>
            <span />
          </div>

          {/* Lignes */}
          <div className="divide-y divide-border/60">
            {users.map((user) => {
              const isSelf = session?.user.id === user.id
              const style = roleStyle(user.role)
              const banned = (user as { banned?: boolean }).banned === true

              return (
                <div
                  key={user.id}
                  className={`group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[2fr_1fr_1fr_auto] ${banned ? "opacity-50" : ""}`}
                >
                  {/* Avatar + nom + email */}
                  <div className="flex min-w-0 items-center gap-3.5">
                    <Avatar className="size-9 shrink-0 ring-2 ring-border/50">
                      <AvatarImage src={user.image ?? ""} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 text-xs font-bold dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
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
                    </div>
                  </div>

                  {/* Rôle */}
                  <div className="hidden sm:block">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}>
                      <IconCircleFilled className={`size-1.5 ${style.dot}`} />
                      {style.label}
                    </span>
                  </div>

                  {/* Statut */}
                  <div className="hidden sm:block">
                    {banned ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-800/40">
                        <IconCircleFilled className="size-1.5 bg-rose-500" />
                        Banni
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/40">
                        <IconCircleFilled className="size-1.5 bg-emerald-500" />
                        Actif
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <UserActions userId={user.id} isBanned={banned} isSelf={isSelf} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </BureauDataPage>
  )
}
