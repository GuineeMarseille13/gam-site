import { Marquee } from "@/components/Marquee";
import { SectionSplitHeading } from "@/components/section-split-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import {
  dedupeReviewsById,
  getMarqueeRepeatCount,
  mapApiReviewToCard,
  splitReviewsIntoMarqueeRows,
  type ApiReviewLike,
  type ReviewCardData,
} from "@/components/reviews-section-utils";

interface ReviewsSectionProps {
  reviews?: ApiReviewLike[]
}

interface ReviewsMarqueeRowProps {
  rowKey: string
  reviews: ReviewCardData[]
  reverse?: boolean
  className?: string
}

/**
 * Bande défilante — chaque avis n’apparaît que dans une seule rangée.
 */
function ReviewsMarqueeRow({ rowKey, reviews, reverse = false, className }: ReviewsMarqueeRowProps) {
  if (reviews.length === 0) return null

  return (
    <Marquee
      pauseOnHover
      reverse={reverse}
      repeat={getMarqueeRepeatCount(reviews.length)}
      className={className}
      ariaLabel={`Témoignages — rangée ${rowKey}`}
    >
      {reviews.map((review) => (
        <TestimonialCard key={`${rowKey}-${review.id}`} {...review} />
      ))}
    </Marquee>
  )
}

/**
 * Section témoignages page d’accueil — alimentée par le bureau (avis actifs).
 * Ne rend rien s’il n’y a aucun avis.
 */
function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const uniqueReviews = dedupeReviewsById(reviews ?? [])
  const list = uniqueReviews.map((review, idx) => mapApiReviewToCard(review, idx))

  if (list.length === 0) {
    return null
  }

  const { firstRow, secondRow } = splitReviewsIntoMarqueeRows(list)

  return (
    <section className="relative w-full overflow-hidden py-10 md:py-12 bg-gradient-to-b from-white via-sky-50/25 to-white dark:via-sky-950/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <SectionSplitHeading
            headingClassName="max-w-5xl mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            title="Les avis des personnes qui nous ont fait confiance"
            tone="reviews"
          />
          <p className="mt-3 text-base sm:mt-4 sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Découvrez ce que nos bénéficiaires, nos membres, nos bénévoles et nos partenaires pensent de notre association
          </p>
        </div>

        <div className="relative -mx-4 sm:mx-0">
          <ReviewsMarqueeRow
            rowKey="first"
            reviews={firstRow}
            className="[--duration:38s] [--gap:0.75rem] mb-3 md:mb-4 md:[--duration:25s] md:[--gap:1rem]"
          />
          <ReviewsMarqueeRow
            rowKey="second"
            reviews={secondRow}
            reverse
            className="[--duration:38s] [--gap:0.75rem] md:[--duration:25s] md:[--gap:1rem]"
          />

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-16 md:w-1/4 md:via-white/80" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-16 md:w-1/4 md:via-white/80" />
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
