import { Marquee } from "@/components/Marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

/** Avis API / Prisma (firstName + lastName, rôle via relation Role.labelFr). */
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
  rating?: number | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
}

interface ReviewsSectionProps {
  reviews?: ApiReviewLike[]
}

// Données par défaut des témoignages pour l'association GAM
const defaultTestimonials = [
  {
    name: "Fatoumata Diallo",
    role: "Membre active",
    body: "L'association GAM m'a permis de rencontrer une communauté chaleureuse et de participer à des actions solidaires qui ont du sens. Une expérience enrichissante !",
    img: "https://randomuser.me/api/portraits/women/32.jpg",
    country: "🇬🇳 Guinée",
    rating: 5,
  },
  {
    name: "Amadou Camara",
    role: "Bénévole",
    body: "Je suis fier de faire partie de cette association qui œuvre pour le développement culturel et social. Les événements organisés sont toujours de qualité.",
    img: "https://randomuser.me/api/portraits/men/51.jpg",
    country: "🇬🇳 Guinée",
    rating: 5,
  },
  {
    name: "Aissatou Bah",
    role: "Participante",
    body: "Grâce à GAM, j'ai découvert ma culture sous un nouveau jour. Les activités sont variées et accessibles à tous. Je recommande vivement !",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    country: "🇫🇷 France",
    rating: 5,
  },
  {
    name: "Moussa Traoré",
    role: "Donateur",
    body: "Une association transparente et efficace. Je vois concrètement l'impact de mes dons dans les actions menées. Continuez ainsi !",
    img: "https://randomuser.me/api/portraits/men/33.jpg",
    country: "🇬🇳 Guinée",
    rating: 5,
  },
  {
    name: "Mariama Sow",
    role: "Membre fondatrice",
    body: "GAM représente tout ce en quoi je crois : solidarité, culture et partage. C'est un honneur de voir l'association grandir et toucher de plus en plus de personnes.",
    img: "https://randomuser.me/api/portraits/women/53.jpg",
    country: "🇬🇳 Guinée",
    rating: 5,
  },
  {
    name: "Ibrahima Barry",
    role: "Bénévole",
    body: "L'engagement de l'équipe est remarquable. Chaque événement est préparé avec soin et l'accueil est toujours chaleureux. Bravo à toute l'équipe !",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    country: "🇫🇷 France",
    rating: 5,
  },
  {
    name: "Kadiatou Diallo",
    role: "Participante",
    body: "J'ai participé à plusieurs ateliers et événements. L'ambiance est conviviale et les organisateurs sont à l'écoute. Une belle expérience humaine !",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
    country: "🇬🇳 Guinée",
    rating: 5,
  },
  {
    name: "Ousmane Keita",
    role: "Partenaire",
    body: "Travailler avec GAM est un plaisir. Leur professionnalisme et leur engagement sont exemplaires. Une association qui mérite tout notre soutien.",
    img: "https://randomuser.me/api/portraits/men/61.jpg",
    country: "🇫🇷 France",
    rating: 5,
  },
  {
    name: "Aminata Touré",
    role: "Membre",
    body: "Rejoindre GAM a été l'une des meilleures décisions. J'ai rencontré des personnes formidables et contribué à des projets qui me tiennent à cœur.",
    img: "https://randomuser.me/api/portraits/women/85.jpg",
    country: "🇬🇳 Guinée",
    rating: 5,
  },
];

// Fonction pour convertir le rating en nombre
function ratingToNumber(rating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'): number {
  const map = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5,
  };
  return map[rating];
}

function TestimonialCard({
  img,
  name,
  role,
  body,
  country,
  rating,
}: (typeof testimonials)[number]) {
  return (
    <Card className="w-72 sm:w-80 shrink-0 border-2 border-gray-100 hover:border-amber-300 transition-colors duration-300 shadow-md hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="size-12 border-2 border-amber-200">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-white font-semibold">
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <figcaption className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="truncate">{name}</span>
              <span className="text-xs flex-shrink-0">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-amber-600 mt-0.5">
              {role}
            </p>
            {/* Étoiles de notation */}
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${name}-${i}`}
                  className={`size-3 ${
                    i < rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <blockquote className="text-sm text-gray-700 leading-relaxed line-clamp-4">
          "{body}"
        </blockquote>
      </CardContent>
    </Card>
  );
}

function mapApiReviewToCard(review: ApiReviewLike, idx: number) {
  const name =
    review.name?.trim() ||
    [review.firstName, review.lastName].filter(Boolean).join(" ").trim() ||
    "Anonyme"
  const roleLabel =
    typeof review.role === "object" && review.role !== null && "labelFr" in review.role
      ? review.role.labelFr
      : typeof review.role === "string"
        ? review.role
        : ""
  const img = review.img ?? review.avatarUrl ?? undefined
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

const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
  // Transformer les reviews de l'API en format attendu par le composant
  const testimonials = reviews && reviews.length > 0
    ? reviews.map((review, idx) => mapApiReviewToCard(review, idx))
    : defaultTestimonials.map((review, idx) => ({
        id: `default-review-${idx}`,
        ...review,
      }));

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden py-10 md:py-12 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de la section */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent mb-3">
            Les avis des personnes qui nous ont fait confiance
          </h2>
          <div className="mt-3 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full" />
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Découvrez ce que nos membres, bénévoles et partenaires pensent de
            notre association
          </p>
        </div>

        {/* Conteneur des marquees */}
        <div className="relative">
          {/* Marquee horizontal (vers la gauche) */}
          <Marquee pauseOnHover repeat={3} className="[--duration:25s] mb-4">
            {testimonials.map((review, index) => (
              <TestimonialCard key={`review-left-${review.id || review.name}-${index}`} {...review} />
            ))}
          </Marquee>

          {/* Marquee horizontal (vers la droite) */}
          <Marquee
            pauseOnHover
            reverse
            repeat={3}
            className="[--duration:25s]"
          >
            {testimonials.map((review, index) => (
              <TestimonialCard key={`review-right-${review.id || review.name}-${index}`} {...review} />
            ))}
          </Marquee>

          {/* Gradients pour les bords horizontaux */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white via-white/80 to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
