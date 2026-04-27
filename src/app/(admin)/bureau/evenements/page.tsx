import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Badge } from "@/components/ui/badge"
import { RowActions } from "@/components/bureau/row-actions"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { deleteEvenement } from "./_actions/actions"
import { IconCalendarX, IconMapPin, IconEye, IconEyeOff, IconPhoto } from "@tabler/icons-react"
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
    accent:  "border-t-blue-500",
    card:    "bg-white hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200/70",
    label:  "À venir",
    badge:  "bg-blue-50 text-blue-700 border-blue-200/50",
    dateCls: "text-blue-600 font-medium",
    titleCls: "font-semibold text-slate-900",
  },
  past: {
    accent:  "border-t-slate-200",
    card:    "bg-white hover:shadow-lg hover:border-slate-200/80",
    label:  "Passé",
    badge:  "bg-slate-100 text-slate-600 border-slate-200/50",
    dateCls: "text-slate-500",
    titleCls: "font-medium text-slate-800",
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
    <BureauContent
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
      <div className="space-y-3 sm:space-y-4">
        {evenements.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 sm:py-20 text-slate-500">
            <div className="flex size-14 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200/40">
              <IconCalendarX className="size-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium">
              {activeFilter === "ALL"
                ? "Aucun événement enregistré"
                : "Aucun événement dans cette catégorie"}
            </p>
            {activeFilter === "ALL" && (
              <Link
                href="/bureau/evenements/nouveau"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Créer le premier événement
              </Link>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {evenements.map((event) => {
              const isUpcoming = event.startDate > now
              const cfg = isUpcoming ? TIME_CFG.upcoming : TIME_CFG.past

              return (
                <li
                  key={event.id}
                  className={`group flex flex-col rounded-2xl overflow-hidden border border-slate-200/70 border-t-4 shadow-sm transition-all duration-300 ${cfg.card}`}
                >
                  {/* Image hero */}
                  <div className="relative aspect-[4/3] min-h-[140px] shrink-0 overflow-hidden bg-slate-100">
                    {event.imageId ? (
                      <CloudinaryImage
                        imageId={event.imageId}
                        alt={event.title}
                        thumbSize={360}
                        sizeClassName="absolute inset-0 w-full h-full"
                        imageSizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="rounded-none object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <IconPhoto className="size-12" />
                      </div>
                    )}
                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className={`text-[11px] h-6 px-2.5 font-medium border shadow-sm backdrop-blur-sm ${cfg.badge}`}>
                        {cfg.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[11px] h-6 px-2.5 font-medium border shadow-sm backdrop-blur-sm inline-flex items-center gap-1.5 ${
                          event.published
                            ? "bg-emerald-50/95 text-emerald-700 border-emerald-200/50"
                            : "bg-amber-50/95 text-amber-700 border-amber-200/50"
                        }`}
                      >
                        {event.published ? <IconEye className="size-3" /> : <IconEyeOff className="size-3" />}
                        {event.published ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                    <Link href={`/bureau/evenements/${event.id}/modifier`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg -m-1 p-1">
                      <h3 className={`line-clamp-2 text-base sm:text-lg font-semibold leading-snug hover:text-primary transition-colors ${cfg.titleCls}`}>
                        {event.title}
                      </h3>
                    </Link>

                    {event.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-auto pt-2 border-t border-slate-100">
                      {event.location && (
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                          <IconMapPin className="size-3.5 shrink-0 opacity-75" />
                          <span className="truncate">{event.location}</span>
                        </span>
                      )}
                      <span className={`text-sm tabular-nums font-medium ${cfg.dateCls}`}>
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5 sm:py-3.5">
                    <RowActions
                      editHref={`/bureau/evenements/${event.id}/modifier`}
                      onDelete={deleteEvenement.bind(null, event.id)}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </BureauContent>
  )
}
