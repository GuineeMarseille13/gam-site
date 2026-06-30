interface MembresFilterGroupProps {
  label: string
  children: React.ReactNode
}

/** Groupe de filtres avec libellé et pills en retour à la ligne. */
export function MembresFilterGroup({ label, children }: MembresFilterGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {children}
      </div>
    </div>
  )
}
