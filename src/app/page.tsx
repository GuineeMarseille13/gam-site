"use client";

import Carousel from "@/components/carousel";
import GAMSlogan from "@/components/GAMSlogan";
import PresentationSection from "@/components/PresentationSection";
import PoleSection from "@/components/PoleSection";
import ReviewsSection from "@/components/ReviewsSection";
import StatisticsSection from "@/components/StatisticsSection";
import FloatingElementsAnimation from "@/components/FloatingElementsAnimation";

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

export default function Home() {
  return (
    <div className="font-sans min-h-screen relative overflow-hidden">
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

      <Carousel
        items={carouselItems}
        autoPlay={true}
        interval={5000}
        showDots={true}
        showArrows={false}
        enableSwipe={true}
        loop={true}
        className="h-screen max-h-[85vh] shadow-2xl rounded-xl overflow-hidden"
      />
      <PresentationSection />
      <PoleSection />
      <ReviewsSection />
      <StatisticsSection />
      <GAMSlogan />
    </div>
  );
}
