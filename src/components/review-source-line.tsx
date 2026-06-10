interface ReviewSourceLineProps {
  sourceLabel?: string | null
  sourceImageUrl?: string | null
  className?: string
}

/**
 * Ligne « Avis de … » — style widget d’avis moderne (logo + nom de marque).
 */
export function ReviewSourceLine({
  sourceLabel,
  sourceImageUrl,
  className = "",
}: ReviewSourceLineProps) {
  const label = sourceLabel?.trim() ?? ""
  const imageUrl = sourceImageUrl?.trim() ?? ""

  if (!label && !imageUrl) {
    return null
  }

  return (
    <p
      className={`inline-flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-[0.8125rem] leading-snug text-muted-foreground ${className}`.trim()}
    >
      <span className="shrink-0">Avis de</span>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          className="size-4 shrink-0 object-contain"
        />
      ) : null}
      {label ? (
        <span className="font-medium tracking-tight text-[#1a73e8] dark:text-[#8ab4f8]">
          {label}
        </span>
      ) : null}
    </p>
  )
}
