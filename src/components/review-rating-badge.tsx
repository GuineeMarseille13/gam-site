interface ReviewRatingBadgeProps {
  rating: number
  max?: number
  className?: string
}

/**
 * Note d’avis au format numérique (ex. 5/5).
 */
export function ReviewRatingBadge({
  rating,
  max = 5,
  className = "",
}: ReviewRatingBadgeProps) {
  const value = Math.min(Math.max(Math.round(rating), 1), max)

  return (
    <p
      className={`mt-0.5 inline-flex items-baseline gap-0.5 text-xs tabular-nums ${className}`.trim()}
      aria-label={`Note ${value} sur ${max}`}
    >
      <span className="font-semibold text-amber-500 dark:text-amber-400" aria-hidden>
        {value}
      </span>
      <span className="font-medium text-muted-foreground" aria-hidden>
        /{max}
      </span>
    </p>
  )
}
