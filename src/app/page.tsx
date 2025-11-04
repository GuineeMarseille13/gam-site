"use client";

import Carousel from "@/components/carousel";
import GAMSlogan from "@/components/GAMSlogan";
import PresentationSection from "@/components/PresentationSection";
import PoleSection from "@/components/PoleSection";
import ReviewsSection from "@/components/ReviewsSection";
import StatisticsSection from "@/components/StatisticsSection";
import VolunteersSection from "@/components/VolunteersSection";
import FloatingElementsAnimation from "@/components/FloatingElementsAnimation";
import PartnersCarousel from "@/components/PartnersCarousel";
import ProductsCarousel from "@/components/ProductsCarousel";

// Unique reviews data

const carouselItems = [
  {
    id: 1,
    image:
      "https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg",
    title: "Association GAM",
    description:
      "Découvrez notre association et nos actions en faveur de la communauté",
  },
  {
    id: 2,
    image:
      "https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg",
    title: "Nos Événements",
    description: "Participez à nos événements culturels et caritatifs",
  },
  {
    id: 3,
    image:
      "https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_1280.jpg",
    title: "Adhésion",
    description: "Rejoignez-nous pour contribuer à nos missions",
  },
  {
    id: 4,
    image:
      "https://cdn.pixabay.com/photo/2025/07/05/02/55/together-9697018_1280.png",
    title: "Adhésion",
    description: "Rejoignez-nous pour contribuer à nos missions",
  },
  {
    id: 5,
    image:
      "https://cdn.pixabay.com/photo/2025/07/20/13/12/little-red-riding-hood-9724469_1280.jpg",
    title: "Adhésion",
    description: "Rejoignez-nous pour contribuer à nos missions",
  },
];

// Éléments à faire apparaître aléatoirement
const floatingElements = [
  "🇫🇷",
  "🇬🇳",
  "❤️",
  "🌟",
  "✨",
  "🎉",
  "🌍",
  "🤝",
  "💫",
  "🌺",
  "🎊",
  "🌈",
  "💝",
  "🎯",
  "🏆",
  "🌸",
  "🔥",
  "💪",
  "🎭",
  "🐘",
  "🐓",
];

const partnersData = [
  {
    id: 1,
    name: "Partenaire 1",
    logo: "https://picsum.photos/300/200?random=1",
    description: "Description du partenaire 1",
    website: "https://www.partenaire1.com",
    category: "Catégorie 1",
  },
  {
    id: 2,
    name: "Partenaire 2",
    logo: "https://picsum.photos/300/200?random=2",
    description: "Description du partenaire 2",
    website: "https://www.partenaire2.com",
    category: "Catégorie 2",
  },
  {
    id: 3,
    name: "Partenaire 3",
    logo: "https://picsum.photos/300/200?random=3",
    description: "Description du partenaire 3",
    website: "https://www.partenaire3.com",
    category: "Catégorie 3",
  },
  {
    id: 4,
    name: "Partenaire 4",
    logo: "https://picsum.photos/300/200?random=4",
    description: "Description du partenaire 4",
    website: "https://www.partenaire4.com",
    category: "Catégorie 4",
  },
  {
    id: 5,
    name: "Partenaire 5",
    logo: "https://picsum.photos/300/200?random=5",
    description: "Description du partenaire 5",
    website: "https://www.partenaire5.com",
    category: "Catégorie 5",
  },
];

const productsData = [
  {
    id: 1,
    name: "Produit 1",
    image: "https://picsum.photos/300/200?random=1",
    price: 10,
    originalPrice: 15,
    description: "Description du produit 1",
    category: "Catégorie 1",
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Produit 2",
    image: "https://picsum.photos/300/200?random=2",
    price: 15,
    originalPrice: 20,
    description: "Description du produit 2",
    category: "Catégorie 2",
    inStock: false,
    featured: false,
  },
  {
    id: 3,
    name: "Produit 3",
    image: "https://picsum.photos/300/200?random=3",
    price: 20,
    originalPrice: 25,
    description: "Description du produit 3",
    category: "Catégorie 3",
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    name: "Produit 4",
    image: "https://picsum.photos/300/200?random=4",
    price: 25,
    originalPrice: 30,
    description: "Description du produit 4",
    category: "Catégorie 4",
    inStock: true,
    featured: true,
  },
  {
    id: 5,
    name: "Produit 5",
    image: "https://picsum.photos/300/200?random=5",
    price: 30,
    originalPrice: 35,
    description: "Description du produit 5",
    category: "Catégorie 5",
    inStock: false,
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="font-sans min-h-screen relative space-y-12 md:space-y-16">
      {/* Animation d'éléments flottants */}
      <FloatingElementsAnimation
        elements={floatingElements}
        interval={30000}
        maxElements={1}
        elementSize="lg"
        animationDuration={5000}
        animationTypes={["bloom", "bounce", "spin", "fade"]}
        colors={["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]}
        enableGlow={true}
        enableParticles={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          items={carouselItems}
          autoPlay={true}
          interval={5000}
          showDots={true}
          showArrows={false}
          enableSwipe={true}
          loop={true}
          className="shadow-2xl rounded-xl overflow-hidden"
        />
      </div>
      <PresentationSection />
      <PoleSection />

      {/* Nouveau carousel des partenaires */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PartnersCarousel
          partners={partnersData}
          autoPlay={true}
          interval={5000}
          showDots={true}
          showArrows={true}
          enableSwipe={true}
          loop={true}
          title="Nos Partenaires de Confiance"
          className="bg-white"
        />
      </div>

      <ReviewsSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductsCarousel
          products={productsData}
          autoPlay={true}
          interval={5000}
          showDots={true}
          showArrows={true}
          enableSwipe={true}
          loop={true}
          title="Nos Produits"
          className="bg-white"
        />
      </div>
      <StatisticsSection />
      <VolunteersSection />
      <GAMSlogan />
    </div>
  );
}
