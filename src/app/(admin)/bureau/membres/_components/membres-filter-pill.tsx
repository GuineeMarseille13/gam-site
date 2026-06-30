interface MembresFilterPillProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

/** Pilule de filtre réutilisable (état actif / inactif). */
export function MembresFilterPill({ active, onClick, children }: MembresFilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
          : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
