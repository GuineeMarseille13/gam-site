import Carousel from "@/components/carousel";

const carouselItems = [
  {
    id: 1,
    image: "/images/gam-logo.png",
    title: "Association GAM",
    description:
      "Découvrez notre association et nos actions en faveur de la communauté",
  },
  {
    id: 2,
    image: "/images/gam-logo.png",
    title: "Nos Événements",
    description: "Participez à nos événements culturels et caritatifs",
  },
  {
    id: 3,
    image: "/images/gam-logo.png",
    title: "Adhésion",
    description: "Rejoignez-nous pour contribuer à nos missions",
  },
];

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Carousel avec autoplay optimisé */}
      <section className="w-full">
        <Carousel
          items={carouselItems}
          autoPlay={true}
          interval={5000} // 5 secondes pour une expérience fluide
          showDots={true}
          showArrows={false}
          enableSwipe={true}
          loop={true}
          className="h-screen max-h-[85vh] shadow-2xl rounded-xl overflow-hidden"
        />
      </section>

      {/* Contenu additionnel */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenue sur notre site
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </section>
    </div>
  );
}
