import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Badge } from "@/components/ui/badge"
import { ContactSubmissionStatus } from "@/lib/generated/prisma/enums"
import { SubmissionActions } from "./_components/submission-actions"
import { StatusFilter, type FilterValue } from "./_components/status-filter"
import { IconInbox } from "@tabler/icons-react"

export const metadata: Metadata = { title: "Messages de contact" }

// ── Config statut ─────────────────────────────────────────────────────────────

const STATUS: Record<ContactSubmissionStatus, {
  label: string
  badge: string
  border: string
  dot: string
  isPending: boolean
}> = {
  PENDING:  { label: "En attente", badge: "bg-amber-100 text-amber-700 border-amber-200",       border: "border-l-amber-400",   dot: "bg-amber-400",   isPending: true  },
  READ:     { label: "Lu",         badge: "bg-blue-100 text-blue-700 border-blue-200",           border: "border-l-blue-400",    dot: "bg-blue-400",    isPending: false },
  REPLIED:  { label: "Répondu",    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",  border: "border-l-emerald-400", dot: "bg-emerald-400", isPending: false },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase()
}

function formatDate(date: Date) {
  const now  = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  if (days === 1) return "Hier"
  if (days < 7)  return date.toLocaleDateString("fr-FR", { weekday: "short" })
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: rawStatus } = await searchParams
  const activeFilter = (
    rawStatus && Object.keys(STATUS).includes(rawStatus) ? rawStatus : "ALL"
  ) as FilterValue

  // Toutes les soumissions pour les compteurs
  const all = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } })

  const counts: Record<FilterValue, number> = {
    ALL:     all.length,
    PENDING: all.filter((s) => s.status === "PENDING").length,
    READ:    all.filter((s) => s.status === "READ").length,
    REPLIED: all.filter((s) => s.status === "REPLIED").length,
  }

  // Soumissions filtrées pour l'affichage
  const submissions = activeFilter === "ALL"
    ? all
    : all.filter((s) => s.status === activeFilter)

  return (
    <BureauDataPage
      title="Messages de contact"
      description={`${counts.ALL} message${counts.ALL !== 1 ? "s" : ""} reçu${counts.ALL !== 1 ? "s" : ""}`}
    >
      {/* ── Filtres ── */}
      {counts.ALL > 0 && (
        <StatusFilter counts={counts} current={activeFilter} />
      )}

      {/* ── Liste ── */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <IconInbox className="size-10 opacity-30" />
            <p className="text-sm">
              {activeFilter === "ALL" ? "Aucun message reçu" : "Aucun message dans cette catégorie"}
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {submissions.map((sub) => {
              const cfg      = STATUS[sub.status]
              const initials = getInitials(sub.firstName, sub.lastName)

              return (
                <li
                  key={sub.id}
                  className={`relative flex gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-l-4 transition-colors hover:bg-muted/30 ${cfg.border} ${cfg.isPending ? "bg-amber-50/30" : ""}`}
                >
                  {/* Avatar */}
                  <div className="shrink-0 mt-0.5">
                    <div className={`flex size-9 sm:size-10 items-center justify-center rounded-full text-sm font-semibold ${cfg.isPending ? "bg-amber-500 text-white" : "bg-muted-foreground/20"}`}>
                      <span className={cfg.isPending ? "text-white" : "text-xs font-medium text-muted-foreground"}>
                        {initials}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                      {/* Infos expéditeur + sujet */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className={`text-sm font-semibold ${cfg.isPending ? "text-foreground" : "text-foreground/90"}`}>
                            {sub.firstName} {sub.lastName}
                          </span>
                          <span className={`text-xs font-medium ${cfg.isPending ? "text-amber-700" : "text-foreground/60"}`}>
                            {sub.email}
                          </span>
                          {sub.phone && (
                            <span className={`text-xs font-medium ${cfg.isPending ? "text-amber-700" : "text-foreground/60"}`}>
                              · {sub.phone}
                            </span>
                          )}
                        </div>

                        {/* Sujet */}
                        <p className={`mt-1 text-sm ${cfg.isPending ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                          {sub.subject}
                        </p>

                        {/* Aperçu message */}
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {sub.message}
                        </p>
                      </div>

                      {/* Date + statut */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-1.5 shrink-0">
                        <span className={`text-xs tabular-nums font-medium ${cfg.isPending ? "text-amber-600" : "text-muted-foreground"}`}>
                          {formatDate(sub.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs h-5 px-1.5 border ${cfg.badge}`}>
                            {cfg.label}
                          </Badge>
                          {cfg.isPending && (
                            <span className={`size-2 rounded-full shrink-0 animate-pulse ${cfg.dot}`} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-2 flex justify-end">
                      <SubmissionActions id={sub.id} currentStatus={sub.status} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </BureauDataPage>
  )
}
