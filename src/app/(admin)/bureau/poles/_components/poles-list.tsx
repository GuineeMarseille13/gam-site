import { RowActions } from "@/components/bureau/row-actions"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { deletePole } from "../_actions/actions"
import {
  POLES_LIST_HEADER,
  POLES_LIST_ROW,
  POLES_LIST_WRAPPER,
} from "./poles-list-layout"

export interface PoleListItem {
  id: string
  name: string
  description: string | null
  imageId: string | null
}

interface PolesListProps {
  poles: PoleListItem[]
}

/**
 * Liste des pôles — grille responsive (sans tableau HTML étroit).
 */
export function PolesList({ poles }: PolesListProps) {
  if (poles.length === 0) {
    return (
      <div className="flex min-h-[10rem] items-center justify-center rounded-2xl border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
        Aucun pôle enregistré
      </div>
    )
  }

  return (
    <div className={POLES_LIST_WRAPPER}>
      <div className={POLES_LIST_HEADER}>
        <span>Pôle</span>
        <span className="hidden sm:block">Description</span>
        <span className="hidden text-right lg:block">Actions</span>
      </div>

      <div className="divide-y divide-border/60">
        {poles.map((pole) => (
          <div key={pole.id} className={POLES_LIST_ROW}>
            <PolePrimaryCell pole={pole} />

            <p className="hidden min-w-0 text-sm leading-snug text-muted-foreground sm:block sm:line-clamp-2">
              {pole.description ?? (
                <span className="text-muted-foreground/40">—</span>
              )}
            </p>

            <div className="flex min-w-0 justify-end">
              <RowActions
                editHref={`/bureau/poles/${pole.id}/modifier`}
                onDelete={deletePole.bind(null, pole.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PolePrimaryCell({ pole }: { pole: PoleListItem }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <CloudinaryImage
        imageId={pole.imageId}
        alt={pole.name}
        thumbSize={40}
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{pole.name}</p>
        {pole.description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:hidden">
            {pole.description}
          </p>
        )}
      </div>
    </div>
  )
}
