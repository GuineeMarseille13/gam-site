import { MEMBRES_STATS_GRID } from "./membres-list-layout"

interface MembresStatItem {
  label: string
  count: number
}

interface MembresStatsCardsProps {
  items: MembresStatItem[]
}

/** Cartes de synthèse — grille responsive 2 → 3 → 5 colonnes. */
export function MembresStatsCards({ items }: MembresStatsCardsProps) {
  return (
    <div className={MEMBRES_STATS_GRID}>
      {items.map((stat) => (
        <div key={stat.label} className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs leading-snug text-muted-foreground">{stat.label}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums">
            {stat.count}
          </p>
        </div>
      ))}
    </div>
  )
}
