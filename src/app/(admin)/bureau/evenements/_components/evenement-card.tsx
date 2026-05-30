"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { RowActions } from "@/components/bureau/row-actions"
import { cn } from "@/helpers/utils"
import type { EvenementListItem } from "../_types/evenement-list-item"
import {
  IconEye,
  IconEyeOff,
  IconMapPin,
  IconPhoto,
} from "@tabler/icons-react"

/**
 * Empillement local (carte) — contexte `isolate` sur le média.
 * Ne pas confondre avec le shell admin : header z-20, barre bulk z-30, modales z-50.
 */
const Z = {
  media: "z-0",
  badge: "z-[1]",
  select: "z-[2]",
} as const

interface TimeConfig {
  accent: string
  card: string
  label: string
  badge: string
  dateCls: string
  titleCls: string
}

interface EvenementCardProps {
  event: EvenementListItem
  timeConfig: TimeConfig
  formattedDate: string
  selectionMode: boolean
  isSelected: boolean
  onToggleSelect: () => void
  onDelete: () => Promise<unknown>
}

/**
 * Carte événement bureau avec sélection optionnelle.
 */
export function EvenementCard({
  event,
  timeConfig,
  formattedDate,
  selectionMode,
  isSelected,
  onToggleSelect,
  onDelete,
}: EvenementCardProps) {
  const cfg = timeConfig

  function handleCardClick() {
    if (!selectionMode) return
    onToggleSelect()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!selectionMode) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onToggleSelect()
    }
  }

  return (
    <li
      role={selectionMode ? "button" : undefined}
      tabIndex={selectionMode ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden shadow-sm transition-all duration-300",
        cfg.card,
        selectionMode && "cursor-pointer",
        isSelected
          ? "border-2 border-rose-600"
          : selectionMode
            ? "border-2 border-slate-200/70"
            : "border border-slate-200/70 border-t-4",
      )}
    >
      <div className="relative isolate aspect-[4/3] min-h-[140px] shrink-0 overflow-hidden bg-slate-100">
        <div
          className={cn(
            "absolute inset-0",
            Z.media,
            selectionMode && "pointer-events-none",
          )}
        >
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
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <IconPhoto className="size-12" />
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute top-3 left-3 flex flex-wrap gap-2",
            Z.badge,
            selectionMode && "pointer-events-none",
          )}
        >
          <Badge
            variant="outline"
            className={`text-[11px] h-6 px-2.5 font-medium border shadow-sm backdrop-blur-sm ${cfg.badge}`}
          >
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
            {event.published ? (
              <IconEye className="size-3" />
            ) : (
              <IconEyeOff className="size-3" />
            )}
            {event.published ? "Publié" : "Brouillon"}
          </Badge>
        </div>

        {selectionMode && (
          <div
            className={cn("absolute top-3 right-3", Z.select)}
            onClick={(e) => e.stopPropagation()}
          >
            <label className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/95 shadow-md ring-1 ring-slate-200/60 backdrop-blur-sm">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggleSelect}
                aria-label={`Sélectionner ${event.title}`}
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {selectionMode ? (
          <h3
            className={`line-clamp-2 text-base sm:text-lg font-semibold leading-snug ${cfg.titleCls}`}
          >
            {event.title}
          </h3>
        ) : (
          <Link
            href={`/bureau/evenements/${event.id}/modifier`}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg -m-1 p-1"
          >
            <h3
              className={`line-clamp-2 text-base sm:text-lg font-semibold leading-snug hover:text-primary transition-colors ${cfg.titleCls}`}
            >
              {event.title}
            </h3>
          </Link>
        )}

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
            {formattedDate}
          </span>
        </div>
      </div>

      {!selectionMode && (
        <div
          className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5 sm:py-3.5"
          onClick={(e) => e.stopPropagation()}
        >
          <RowActions
            editHref={`/bureau/evenements/${event.id}/modifier`}
            onDelete={onDelete}
          />
        </div>
      )}
    </li>
  )
}
