import { BureauContent, type BureauContentDashboard } from "@/components/bureau/bureau-content"
import { administrationCardClassName } from "@/config/administration-dashboard-theme"
import { cn } from "@/helpers/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconHandStop, IconPhone, IconMail } from "@tabler/icons-react"
import { BenevoleRowActions } from "@/app/(admin)/bureau/benevoles/_components/benevole-row-actions"
import type { BenevoleListRow } from "@/helpers/benevoles"

export type DashboardBasePath = "/bureau" | "/administration"

interface BenevolesListSectionProps {
  benevoles: BenevoleListRow[]
  basePath: DashboardBasePath
}

/**
 * Liste bénévoles partagée entre /bureau/benevoles et /administration/benevoles.
 */
export function BenevolesListSection({ benevoles, basePath }: BenevolesListSectionProps) {
  const nouveauHref = `${basePath}/benevoles/nouveau`
  const dashboard: BureauContentDashboard =
    basePath === "/administration" ? "administration" : "bureau"
  const isAdministration = dashboard === "administration"

  return (
    <BureauContent
      title="Bénévoles"
      description={`${benevoles.length} bénévole${benevoles.length > 1 ? "s" : ""} — Nos héros du quotidien`}
      addHref={nouveauHref}
      addLabel="Nouveau bénévole"
      dashboard={dashboard}
    >
      {benevoles.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-16 text-center",
            isAdministration
              ? "border-sky-300/40 bg-sky-50/30 dark:border-sky-800/50 dark:bg-sky-950/20"
              : "border-border bg-muted/20",
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl",
              isAdministration ? "bg-sky-500/12 dark:bg-sky-400/10" : "bg-muted/60",
            )}
          >
            <IconHandStop
              className={cn(
                "size-5",
                isAdministration ? "text-sky-600 dark:text-sky-400" : "text-muted-foreground/50",
              )}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Aucun bénévole</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Ajoutez un bénévole via le bouton ci-dessus</p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "overflow-hidden rounded-2xl shadow-sm",
            isAdministration ? administrationCardClassName : "border border-border bg-card",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-[1fr_auto] items-center gap-4 border-b px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr_240px]",
              isAdministration
                ? "border-sky-200/40 bg-sky-50/40 dark:border-sky-800/45 dark:bg-sky-950/25"
                : "bg-muted/30",
            )}
          >
            <span>Bénévole</span>
            <span className="hidden sm:block">Téléphone</span>
            <span className="hidden lg:block">Email</span>
            <span className="hidden lg:block text-right">Actions</span>
          </div>

          <div
            className={cn(
              "divide-y",
              isAdministration ? "divide-sky-200/35 dark:divide-sky-900/50" : "divide-border/60",
            )}
          >
            {benevoles.map((b) => {
              const p = b.person
              const ini = p ? `${p.firstName[0]}${p.lastName[0]}`.toUpperCase() : "?"

              return (
                <div
                  key={b.id}
                  className={cn(
                    "group grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors sm:grid-cols-[2fr_1fr_auto] lg:grid-cols-[2fr_1fr_1fr_240px]",
                    isAdministration
                      ? "hover:bg-sky-50/50 dark:hover:bg-sky-950/35"
                      : "hover:bg-muted/20",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="relative size-9 shrink-0">
                      <Avatar
                        className={cn(
                          "size-9 ring-2",
                          isAdministration ? "ring-sky-200/50 dark:ring-sky-800/50" : "ring-border/40",
                        )}
                      >
                        <AvatarImage src={p?.image ?? ""} alt={p ? `${p.firstName} ${p.lastName}` : ""} className="object-cover" />
                        <AvatarFallback
                          className={cn(
                            "text-xs font-bold",
                            isAdministration
                              ? "bg-gradient-to-br from-sky-100 to-sky-200 text-sky-900 dark:from-sky-900/50 dark:to-sky-800/40 dark:text-sky-100"
                              : "bg-gradient-to-br from-violet-100 to-violet-200 text-violet-800 dark:from-violet-900/40 dark:to-violet-800/40 dark:text-violet-300",
                          )}
                        >
                          {ini}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background shadow-sm",
                          p?.showOnSite
                            ? isAdministration
                              ? "bg-sky-400"
                              : "bg-emerald-400"
                            : "bg-muted-foreground/30",
                        )}
                        title={p?.showOnSite ? "Visible sur le site" : "Masqué du site"}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {p ? `${p.firstName} ${p.lastName}` : "—"}
                      </p>
                      {p?.phone && (
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                          <IconPhone className="size-3 shrink-0" />
                          {p.phone}
                        </p>
                      )}
                      {p?.email && (
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground lg:hidden">
                          <IconMail className="size-3 shrink-0" />
                          {p.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-sm">
                    <IconPhone className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-foreground/80">{p?.phone ?? "—"}</span>
                  </div>

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

                  <BenevoleRowActions
                    volunteerId={b.id}
                    person={b.person}
                    basePath={basePath}
                    dashboard={dashboard}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </BureauContent>
  )
}
