interface MembresFilterScrollProps {
  children: React.ReactNode
  "aria-label": string
}

/**
 * Bandeau de filtres défilable horizontalement sur mobile (pills nombreux).
 */
export function MembresFilterScroll({
  children,
  "aria-label": ariaLabel,
}: MembresFilterScrollProps) {
  return (
    <div
      className="overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label={ariaLabel}
    >
      <div className="flex w-max min-w-full items-center gap-1 rounded-xl border bg-muted/30 p-1">
        {children}
      </div>
    </div>
  )
}
