import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Badge } from "@/components/ui/badge"
import { RowActions } from "@/components/bureau/row-actions"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { deleteEvenement } from "./_actions/actions"
import { IconCalendarX, IconMapPin, IconEye, IconEyeOff } from "@tabler/icons-react"
import { EventFilter, type EventFilterValue } from "./_components/event-filter"

export const metadata: Metadata = { title: "Événements" }

async function getEvenements() {
  return prisma.event.findMany({ orderBy: { startDate: "desc" } })
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

// ── Config visuelle ───────────────────────────────────────────────────────────

const TIME_CFG = {
  upcoming: {
    border:   "border-l-blue-400",
    bg:       "bg-blue-50/20",
    label:    "À venir",
    badge:    "bg-blue-100 text-blue-700 border-blue-200",
    dateCls:  "text-blue-600",
    titleCls: "font-semibold text-foreground",
  },
  past: {
    border:   "border-l-gray-200",
    bg:       "",
    label:    "Passé",
    badge:    "bg-gray-100 text-gray-500 border-gray-200",
    dateCls:  "text-muted-foreground",
    titleCls: "font-medium text-foreground/80",
  },
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EvenementsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter: rawFilter } = await searchParams
  const activeFilter = (["upcoming", "published"].includes(rawFilter ?? "") ? rawFilter : "ALL") as EventFilterValue

  const all = await getEvenements()
  const now = new Date()

  const counts: Record<EventFilterValue, number> = {
    ALL:       all.length,
    upcoming:  all.filter((e) => e.startDate > now).length,
    published: all.filter((e) => e.published).length,
  }

  const evenements = activeFilter === "upcoming"
    ? all.filter((e) => e.startDate > now)
    : activeFilter === "published"
      ? all.filter((e) => e.published)
      : all

  return (
    <BureauDataPage
      title="Événements"
      description={`${counts.ALL} événement${counts.ALL > 1 ? "s" : ""}`}
      addHref="/bureau/evenements/nouveau"
      addLabel="Nouvel événement"
    >
      {/* ── Filtres ── */}
      {counts.ALL > 0 && (
        <EventFilter counts={counts} current={activeFilter} />
      )}

      {/* ── Liste ── */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {evenements.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <IconCalendarX className="size-10 opacity-30" />
            <p className="text-sm">
              {activeFilter === "ALL"
                ? "Aucun événement enregistré"
                : "Aucun événement dans cette catégorie"}
            </p>
            {activeFilter === "ALL" && (
              <Link href="/bureau/evenements/nouveau" className="text-sm font-medium text-primary hover:underline">
                Créer le premier événement
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y">
            {evenements.map((event) => {
              const isUpcoming = event.startDate > now
              const cfg        = isUpcoming ? TIME_CFG.upcoming : TIME_CFG.past

              return (
                <li
                  key={event.id}
                  className={`group flex gap-3 px-4 py-3.5 border-l-4 transition-colors hover:bg-muted/30 sm:px-6 sm:py-4 ${cfg.border} ${cfg.bg}`}
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 mt-0.5">
                    <CloudinaryImage imageId={event.imageId} alt={event.title} thumbSize={44} />
                  </div>

                  {/* Contenu */}
                  <div className="min-w-0 flex-1">

                    {/* Ligne 1 : titre + badges */}
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug truncate ${cfg.titleCls}`}>
                        {event.title}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Badge variant="outline" className={`text-[10px] h-[18px] px-1.5 border ${cfg.badge}`}>
                          {cfg.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-[18px] px-1.5 border inline-flex items-center gap-0.5 ${
                            event.published
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }`}
                        >
                          {event.published
                            ? <><IconEye className="size-2.5" />Publié</>
                            : <><IconEyeOff className="size-2.5" />Brouillon</>
                          }
                        </Badge>
                      </div>
                    </div>

                    {/* Ligne 2 : description */}
                    {event.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {event.description}
                      </p>
                    )}

                    {/* Ligne 3 : lieu · date + actions */}
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        {event.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <IconMapPin className="size-3 shrink-0 opacity-60" />
                            {event.location}
                          </span>
                        )}
                        <span className={`text-xs tabular-nums font-medium shrink-0 ${cfg.dateCls}`}>
                          {formatDate(event.startDate)}
                        </span>
                      </div>
                      <RowActions
                        editHref={`/bureau/evenements/${event.id}/modifier`}
                        onDelete={deleteEvenement.bind(null, event.id)}
                      />
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
