/** Données avis brutes (API / service accueil). */
export interface ApiReviewLike {
  id?: string
  firstName?: string
  lastName?: string
  name?: string
  body?: string
  img?: string
  avatarUrl?: string | null
  sourceLabel?: string | null
  sourceImageUrl?: string | null
  rating?: number | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
}

export interface ReviewCardData {
  id: string
  name: string
  body: string
  img: string
  rating: number
  sourceLabel: string | null
  sourceImageUrl: string | null
}

const RATING_MAP = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
} as const

/**
 * Supprime les avis en double (même id) en conservant le premier.
 */
export function dedupeReviewsById(reviews: ApiReviewLike[]): ApiReviewLike[] {
  const seen = new Set<string>()
  const result: ApiReviewLike[] = []

  reviews.forEach((review, index) => {
    const id = review.id?.trim() || `review-fallback-${index}`
    if (seen.has(id)) return
    seen.add(id)
    result.push(review)
  })

  return result
}

/**
 * Répartit les avis sur deux bandeaux défilants sans chevauchement.
 */
export function splitReviewsIntoMarqueeRows<T>(items: T[]): { firstRow: T[]; secondRow: T[] } {
  const firstRow: T[] = []
  const secondRow: T[] = []

  items.forEach((item, index) => {
    if (index % 2 === 0) firstRow.push(item)
    else secondRow.push(item)
  })

  return { firstRow, secondRow }
}

/**
 * Répétitions DOM pour une boucle marquee fluide (2 copies max, au lieu de 3).
 */
export function getMarqueeRepeatCount(itemCount: number): number {
  if (itemCount <= 0) return 1
  return 2
}

export function mapApiReviewToCard(review: ApiReviewLike, idx: number): ReviewCardData {
  const name =
    review.name?.trim() ||
    [review.firstName, review.lastName].filter(Boolean).join(" ").trim() ||
    "Anonyme"
  const img = review.img ?? review.avatarUrl ?? ""
  const ratingNum =
    typeof review.rating === "number"
      ? review.rating
      : review.rating
        ? RATING_MAP[review.rating]
        : 5

  return {
    id: review.id?.trim() || `review-${idx}`,
    name,
    body: review.body ?? "",
    img,
    rating: ratingNum,
    sourceLabel: review.sourceLabel ?? null,
    sourceImageUrl: review.sourceImageUrl ?? null,
  }
}
