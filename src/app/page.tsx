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
    <div className="font-sans min-h-screen bg-gradient-to-br from-theme-white via-theme-white-dark to-gray-100 relative overflow-hidden">
      {/* Dégradé de fond subtil avec les couleurs du thème */}
      <div className="absolute inset-0 bg-gradient-to-br from-theme-red/5 via-transparent via-theme-yellow/3 to-theme-green/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-theme-blue/5 via-transparent to-theme-red/3 pointer-events-none" />

      {/* Hero Carousel avec autoplay optimisé */}
      <section className="w-full relative z-10">
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
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-theme-red via-theme-yellow to-theme-green bg-clip-text text-transparent">
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
