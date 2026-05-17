import { Marquee } from "@/components/Marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { SectionSplitHeading } from "@/components/section-split-heading";

/** Données avis (API / service accueil). */
interface ApiReviewLike {
  id?: string
  firstName?: string
  lastName?: string
  name?: string
  body?: string
  img?: string
  avatarUrl?: string | null
  country?: string | null
  role?: string | { labelFr: string }
  poste?: string | { labelFr: string }
  rating?: number | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
}

interface ReviewsSectionProps {
  reviews?: ApiReviewLike[]
}

function ratingToNumber(rating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"): number {
  const map = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  }
  return map[rating]
}

function TestimonialCard({
  img,
  name,
  role,
  body,
  country,
  rating,
}: {
  img: string
  name: string
  role: string
  body: string
  country: string
  rating: number
}) {
  return (
    <Card className="w-72 sm:w-80 shrink-0 border-2 border-border/70 bg-card text-card-foreground transition-colors duration-300 shadow-md hover:border-primary/45 hover:shadow-lg dark:border-border dark:hover:border-primary/50">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="size-12 border-2 border-primary/20">
            <AvatarImage src={img} alt="" />
            <AvatarFallback className="bg-primary/15 text-primary font-semibold dark:bg-primary/25 dark:text-primary">
              {name[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <figcaption className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="truncate">{name}</span>
              {country ? <span className="text-xs flex-shrink-0 text-muted-foreground">{country}</span> : null}
            </figcaption>
            <p className="text-xs font-medium text-primary mt-0.5">{role}</p>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${name}-${i}`}
                  className={`size-3 ${
                    i < rating
                      ? "fill-[var(--theme-yellow)] text-[var(--theme-yellow)]"
                      : "fill-muted-foreground/20 text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <blockquote className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          <span aria-hidden="true">&ldquo;</span>
          {body}
          <span aria-hidden="true">&rdquo;</span>
        </blockquote>
      </CardContent>
    </Card>
  )
}

function mapApiReviewToCard(review: ApiReviewLike, idx: number) {
  const name =
    review.name?.trim() ||
    [review.firstName, review.lastName].filter(Boolean).join(" ").trim() ||
    "Anonyme"
  const roleLabel =
    typeof review.poste === "object" && review.poste !== null && "labelFr" in review.poste
      ? review.poste.labelFr
      : typeof review.poste === "string"
        ? review.poste
        : typeof review.role === "object" && review.role !== null && "labelFr" in review.role
          ? review.role.labelFr
          : typeof review.role === "string"
            ? review.role
        : ""
  const img = review.img ?? review.avatarUrl ?? ""
  const ratingNum =
    typeof review.rating === "number"
      ? review.rating
      : review.rating
        ? ratingToNumber(review.rating)
        : 5
  return {
    id: review.id || `review-${idx}`,
    name,
    role: roleLabel,
    body: review.body ?? "",
    img,
    country: review.country ?? "",
    rating: ratingNum,
  }
}

/**
 * Section témoignages page d’accueil — alimentée par le bureau (avis actifs).
 * Ne rend rien s’il n’y a aucun avis.
 */
function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const list = reviews?.length
    ? reviews.map((review, idx) => mapApiReviewToCard(review, idx))
    : []

  if (list.length === 0) {
    return null
  }

  return (
    <section className="relative w-full overflow-hidden py-10 md:py-12 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <SectionSplitHeading
            headingClassName="max-w-5xl mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            title="Les avis des personnes qui nous ont fait confiance"
            tone="reviews"
          />
          <p className="mt-3 text-base sm:mt-4 sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Découvrez ce que nos membres, bénévoles et partenaires pensent de notre association
          </p>
        </div>

        <div className="relative">
          <Marquee pauseOnHover repeat={3} className="[--duration:25s] mb-4">
            {list.map((review, index) => (
              <TestimonialCard key={`review-left-${review.id}-${index}`} {...review} />
            ))}
          </Marquee>

          <Marquee pauseOnHover reverse repeat={3} className="[--duration:25s]">
            {list.map((review, index) => (
              <TestimonialCard key={`review-right-${review.id}-${index}`} {...review} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
