import { Marquee } from "@/components/Marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Unique reviews data
const testimonials = [
  {
    name: "Ava Green",
    username: "@ava",
    body: "Cascade AI made my workflow 10x faster!",
    img: "https://randomuser.me/api/portraits/women/32.jpg",
    country: "🇦🇺 Australia",
  },
  {
    name: "Ana Miller",
    username: "@ana",
    body: "Vertical marquee is a game changer!",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    country: "🇩🇪 Germany",
  },
  {
    name: "Mateo Rossi",
    username: "@mat",
    body: "Animations are buttery smooth!",
    img: "https://randomuser.me/api/portraits/men/51.jpg",
    country: "🇮🇹 Italy",
  },
  {
    name: "Maya Patel",
    username: "@maya",
    body: "Setup was a breeze!",
    img: "https://randomuser.me/api/portraits/women/53.jpg",
    country: "🇮🇳 India",
  },
  {
    name: "Noah Smith",
    username: "@noah",
    body: "Best marquee component!",
    img: "https://randomuser.me/api/portraits/men/33.jpg",
    country: "🇺🇸 USA",
  },
  {
    name: "Lucas Stone",
    username: "@luc",
    body: "Very customizable and smooth.",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    country: "🇫🇷 France",
  },
  {
    name: "Haruto Sato",
    username: "@haru",
    body: "Impressive performance on mobile!",
    img: "https://randomuser.me/api/portraits/men/85.jpg",
    country: "🇯🇵 Japan",
  },
  {
    name: "Emma Lee",
    username: "@emma",
    body: "Love the pause on hover feature!",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
    country: "🇨🇦 Canada",
  },
  {
    name: "Carlos Ray",
    username: "@carl",
    body: "Great for testimonials and logos.",
    img: "https://randomuser.me/api/portraits/men/61.jpg",
    country: "🇪🇸 Spain",
  },
];

function TestimonialCard({
  img,
  name,
  username,
  body,
  country,
}: (typeof testimonials)[number]) {
  return (
    <Card className="w-50">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt="@reui_io" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">
              {username}
            </p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-econdary-foreground">
          {body}
        </blockquote>
      </CardContent>
    </Card>
  );
}

const ReviewsSection = () => {
  return (
    <div
      className="relative max-h-[600px] w-full overflow-hidden flex flex-col items-center justify-center gap-6 my-10"
      style={{
        transform: "perspective(1000px)",
      }}
    >
      <h4 className="text-3xl font-bold text-slate-500 bg-gradient-to-r from-blue-500 via-red-500 to-indigo-500 bg-clip-text text-transparent">
        Les avis des personnes qui nous ont fait confiance.
      </h4>
      <div className="flex flex-col gap-4 h-full">
        {/* Marquee horizontal (vers la gauche) */}
        <Marquee pauseOnHover repeat={3} className="[--duration:20s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Marquee horizontal (vers la droite) */}
        <Marquee pauseOnHover reverse repeat={3} className="[--duration:20s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Gradients pour les bords horizontaux */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
};

export default ReviewsSection;
