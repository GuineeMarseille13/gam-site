"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Carousel from "@/components/carousel";
import GAMSlogan from "@/components/GAMSlogan";
import PresentationSection from "@/components/PresentationSection";
import PoleSection from "@/components/PoleSection";
import ReviewsSection from "@/components/ReviewsSection";
import StatisticsSection from "@/components/StatisticsSection";
import VolunteersSection from "@/components/VolunteersSection";
import FloatingElementsAnimation from "@/components/FloatingElementsAnimation";
import PartnersCarousel from "@/components/PartnersCarousel";
import EventsSection from "@/components/EventsSection";
import VideoTestimonialsSection from "@/components/VideoTestimonialsSection";
import { ProductsCircularCarousel } from "@/components/ProductsCircularCarousel";
import { useCart } from "@/app/(public)/boutique/_hooks/use-cart";
import type { Product } from "@/app/(public)/boutique/_schemas/product.schema";
import {
  useCarouselItems,
  usePartners,
  usePoles,
  useRecentEvents,
  useReviews,
  useStatistics,
  useVolunteers,
  useFeaturedProducts,
  useVideoTestimonials,
  useSocialMedias,
} from "@/app/_hooks/use-home-data";
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery";
import type { CarouselItem, FeaturedProductRecord } from "@/app/_services/home";
import {
  CarouselSkeleton,
  PartnersCarouselSkeleton,
  EventsSectionSkeleton,
  ReviewsSectionSkeleton,
  ProductsSectionSkeleton,
  StatisticsSectionSkeleton,
  VolunteersSectionSkeleton,
  PresentationSectionSkeleton,
  PoleSectionSkeleton,
  GAMSloganSkeleton,
} from "@/components/skeletons";

// ============================================================================
// CONSTANTES DE CONFIGURATION
// ============================================================================

/**
 * Configuration du carrousel principal
 */
const CAROUSEL_CONFIG = {
  autoPlay: true,
  interval: 5000,
  showDots: true,
  showArrows: false,
  enableSwipe: true,
  loop: true,
} as const;

/**
 * Configuration de l'animation des éléments flottants
 */
const FLOATING_ELEMENTS_CONFIG = {
  interval: 30000,
  maxElements: 1,
  elementSize: "lg" as const,
  animationDuration: 5000,
  animationTypes: ["bloom", "bounce", "spin", "fade"] as (
    | "bloom"
    | "bounce"
    | "spin"
    | "fade"
  )[],
  colors: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"],
  enableGlow: true,
  enableParticles: false,
};

// ============================================================================
// DONNÉES STATIQUES
// ============================================================================

/**
 * Éléments emoji à afficher dans l'animation flottante
 */
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

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

/**
 * Page d'accueil principale
 * Affiche plusieurs sections : carrousel, présentation, produits, statistiques, etc.
 */
export default function Home() {
  // Récupération des données dynamiques
  const { data: carouselItems = [], isLoading: isLoadingCarousel } = useCarouselItems();
  const { data: partnersData = [], isLoading: isLoadingPartners } = usePartners();
  const { data: polesData = [], isLoading: isLoadingPoles } = usePoles();
  const { data: recentEvents = [], isLoading: isLoadingEvents } = useRecentEvents();
  const { data: reviews = [], isLoading: isLoadingReviews } = useReviews();
  const { data: statistics = [], isLoading: isLoadingStatistics } = useStatistics();
  const { data: volunteers = [], isLoading: isLoadingVolunteers } = useVolunteers();
  const { data: featuredProducts = [], isLoading: isLoadingProducts } = useFeaturedProducts();
  const { data: videoTestimonials = [] } = useVideoTestimonials();
  const { data: socialMedias = [] } = useSocialMedias();

  const { add } = useCart();
  const router = useRouter();

  // Données par défaut pour le carrousel si l'API ne retourne rien
  type DefaultCarouselSlide = {
    id: number
    image: string
    title: string
    description: string
  }

  const defaultCarouselItems = useMemo(() => [
    {
      id: 1,
      image: "https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg",
      title: "Association GAM",
      description: "Découvrez notre association et nos actions en faveur de la communauté",
    },
    {
      id: 2,
      image: "https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg",
      title: "Nos Événements",
      description: "Participez à nos événements culturels et caritatifs",
    },
    {
      id: 3,
      image: "https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_1280.jpg",
      title: "Adhésion",
      description: "Rejoignez-nous pour contribuer à nos missions",
    },
  ], []);

  // Transformer les données du carrousel pour correspondre au format attendu
  const transformedCarouselItems = useMemo(() => {
    const itemsToUse: (CarouselItem | DefaultCarouselSlide)[] =
      carouselItems.length > 0 ? carouselItems : defaultCarouselItems;
    return itemsToUse.map((item) => {
      const idNum =
        typeof item.id === "string"
          ? parseInt(item.id, 10) || 0
          : typeof item.id === "number"
            ? item.id
            : 0;
      return {
        id: idNum,
        image: item.image || "",
        title: item.title || "",
        description: item.description || "",
      };
    });
  }, [carouselItems, defaultCarouselItems]);

  // Transformer les données des partenaires pour correspondre au format attendu
  const transformedPartners = useMemo(() => {
    return partnersData.map((partner) => ({
      id: parseInt(partner.id) || 0,
      name: partner.name,
      logo: partner.logo,
      description: partner.description,
      website: partner.website,
      category: partner.category,
    }));
  }, [partnersData]);

  // Transformer les données des produits pour correspondre au format attendu
  const transformedProducts = useMemo(() => {
    return featuredProducts.map((product: FeaturedProductRecord) => {
      const pct = product.discountPercent ?? 0;
      const hasDiscount = Boolean(product.discountActive && pct > 0);
      // `price` vient de Prisma en centimes → conversion en euros pour l’affichage.
      const basePriceEur = product.price / 100;
      const effectivePrice = hasDiscount
        ? Math.round(product.price * (1 - pct / 100)) / 100
        : basePriceEur;
      return {
        id: product.id,
        name: product.title ?? "",
        image: product.imageId
          ? cloudinaryImageUrl(product.imageId, "w_600,h_600,c_fill,q_auto,f_auto")
          : "",
        price: effectivePrice,
        originalPrice: hasDiscount ? basePriceEur : undefined,
        discount: hasDiscount ? pct : undefined,
        description: product.description ?? undefined,
        inStock: (product.stock ?? 0) > 0,
      };
    });
  }, [featuredProducts]);

  // Fonction pour gérer le clic sur "Commander"
  const handleOrder = useCallback((product: Product) => {
    // Ajouter le produit au panier
    add({ product, quantity: 1 });
    // Naviguer vers la boutique avec le paramètre produit
    router.push(`/boutique?product=${product.id}&openCart=true`);
  }, [add, router]);

  // Déterminer si on est en mode chargement global
  const isInitialLoading = isLoadingCarousel || isLoadingPartners || isLoadingEvents || 
                           isLoadingReviews || isLoadingProducts || isLoadingStatistics || isLoadingVolunteers;

  return (
    <div className="font-sans min-h-screen relative space-y-8 md:space-y-10">
      {/* Animation d'éléments flottants - toujours affichée */}
      <FloatingElementsAnimation
        elements={floatingElements}
        {...FLOATING_ELEMENTS_CONFIG}
      />

      {/* Carrousel principal - Remplacé complètement par le skeleton */}
      {isLoadingCarousel ? (
        <CarouselSkeleton />
      ) : (
        transformedCarouselItems.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Carousel
              items={transformedCarouselItems}
              {...CAROUSEL_CONFIG}
              className="shadow-xl rounded-xl overflow-hidden"
            />
          </div>
        )
      )}

      {/* Section Présentation - Remplacée complètement par le skeleton pendant le chargement initial */}
      {isInitialLoading ? (
        <PresentationSectionSkeleton />
      ) : (
        <PresentationSection />
      )}

      {/* Section Pôles - données dynamiques depuis le bureau */}
      {isLoadingPoles ? (
        <PoleSectionSkeleton />
      ) : (
        <PoleSection poles={polesData.length > 0 ? polesData : undefined} />
      )}

      {/* Carrousel des partenaires - Remplacé complètement par le skeleton */}
      {isLoadingPartners ? (
        <PartnersCarouselSkeleton />
      ) : (
        transformedPartners.length > 0 && (
          <PartnersCarousel
            partners={transformedPartners}
            {...CAROUSEL_CONFIG}
            showArrows={true}
            title="Nos Partenaires de Confiance"
            className="bg-white"
          />
        )
      )}

      {/* Section Nos Événements - Remplacée complètement par le skeleton */}
      {isLoadingEvents ? (
        <EventsSectionSkeleton />
      ) : (
        <EventsSection
          events={
            recentEvents.length > 0
              ? recentEvents.map((event, idx) => ({
                  id: idx + 1,
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  image: event.image,
                  video: event.video,
                  location: event.location,
                  media: event.media,
                }))
              : undefined
          }
        />
      )}

      {/* Section Produits */}
      {isLoadingProducts ? (
        <ProductsSectionSkeleton />
      ) : (
        transformedProducts.length > 0 && (
          <ProductsCircularCarousel
            products={transformedProducts}
            onAdd={handleOrder}
            {...CAROUSEL_CONFIG}
            showArrows
          />
        )
      )}

      {/* Section Témoignages texte — pas de skeleton « avis » tant que les produits chargent, pour éviter qu’il soit confondu avec la section Nos produits */}
      {isLoadingReviews ? (
        isLoadingProducts ? null : (
          <ReviewsSectionSkeleton />
        )
      ) : (
        <ReviewsSection reviews={reviews} />
      )}

      {/* Section Témoignages vidéo */}
      <VideoTestimonialsSection videos={videoTestimonials} />

      {/* Section Statistiques - Remplacée complètement par le skeleton */}
      {isLoadingStatistics ? (
        <StatisticsSectionSkeleton />
      ) : (
        <StatisticsSection statistics={statistics} />
      )}

      {/* Section Bénévoles et Slogan */}
      <div className="space-y-0">
        {isLoadingVolunteers ? (
          <VolunteersSectionSkeleton />
        ) : (
          <VolunteersSection volunteers={volunteers} />
        )}
        
        {/* Slogan GAM - Remplacé complètement par le skeleton pendant le chargement initial */}
        {isInitialLoading ? (
          <GAMSloganSkeleton />
        ) : (
          <GAMSlogan socialMedias={socialMedias} />
        )}
      </div>
    </div>
  );
}
