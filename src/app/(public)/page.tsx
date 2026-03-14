"use client";

import { useMemo, useRef, useCallback, useState, useEffect } from "react";
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
import { ProductCard } from "@/app/(public)/boutique/_components/product-card";
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
} from "@/app/_hooks/use-home-data";
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
 * Configuration du carrousel de produits
 */
const PRODUCTS_CAROUSEL_CONFIG = {
  autoScrollInterval: 3000, // Intervalle entre chaque défilement automatique (ms)
  scrollAmount: 0.9, // Pourcentage de la largeur du conteneur à défiler
  repositionThreshold: 0.5, // Seuil de repositionnement (50% de la largeur visible)
  catalogDuplications: 3, // Nombre de copies du catalogue pour le scroll infini
  initializationDelay: 100, // Délai avant l'initialisation du scroll (ms)
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
// HOOK PERSONNALISÉ : Gestion du carrousel circulaire infini
// ============================================================================

/**
 * Hook personnalisé pour gérer le carrousel circulaire infini
 *
 * @param catalog - Liste des produits à afficher
 * @returns Objet contenant les refs, états et fonctions nécessaires au carrousel
 */
function useInfiniteCarousel(catalog: Product[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const lastScrollLeftRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  /**
   * Crée un catalogue dupliqué pour permettre le scroll circulaire infini
   * Le catalogue est dupliqué plusieurs fois pour créer l'illusion d'un scroll sans fin
   */
  const duplicatedCatalog = useMemo(() => {
    if (catalog.length === 0) return [];
    return Array(PRODUCTS_CAROUSEL_CONFIG.catalogDuplications)
      .fill(catalog)
      .flat();
  }, [catalog]);

  /**
   * Calcule la largeur totale d'une série complète de produits
   * Cette valeur est utilisée pour déterminer où repositionner le scroll
   *
   * @returns La largeur totale d'une série complète en pixels, ou 0 si impossible à calculer
   */
  const getSingleSetWidth = useCallback(() => {
    // Vérification SSR
    if (typeof window === "undefined") return 0;

    const container = scrollRef.current;
    if (!container || catalog.length === 0) return 0;

    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return 0;

    // Calcul de la largeur d'un élément + espacement (gap)
    const itemWidth = firstChild.offsetWidth;
    const computedStyle = window.getComputedStyle(container);
    const gap = parseFloat(computedStyle.gap) || 20;

    return catalog.length * (itemWidth + gap);
  }, [catalog.length]);

  /**
   * Repositionne le scroll de manière invisible pour créer l'illusion d'un scroll infini
   *
   * @param container - L'élément conteneur du carrousel
   * @param newScrollLeft - La nouvelle position de scroll
   */
  const repositionScroll = useCallback(
    (container: HTMLDivElement, newScrollLeft: number) => {
      isScrollingRef.current = true;
      container.style.scrollBehavior = "auto";
      container.scrollLeft = newScrollLeft;

      requestAnimationFrame(() => {
        if (container) {
          container.style.scrollBehavior = "";
          isScrollingRef.current = false;
        }
      });
    },
    []
  );

  /**
   * Initialise le scroll à la position du milieu (début de la deuxième série)
   * Cela permet de pouvoir scroller dans les deux sens sans voir les limites
   */
  useEffect(() => {
    if (!scrollRef.current || catalog.length === 0) return;

    const timeoutId = setTimeout(() => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth > 0 && scrollRef.current) {
        scrollRef.current.scrollLeft = singleSetWidth;
        lastScrollLeftRef.current = singleSetWidth;
      }
    }, PRODUCTS_CAROUSEL_CONFIG.initializationDelay);

    return () => clearTimeout(timeoutId);
  }, [catalog.length, getSingleSetWidth]);

  /**
   * Gère le repositionnement automatique lors du scroll manuel
   * Repositionne de manière invisible avant d'atteindre les limites
   */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || catalog.length === 0) return;

    const handleScroll = () => {
      // Ignorer les événements de scroll pendant un repositionnement programmé
      if (isScrollingRef.current) {
        lastScrollLeftRef.current = container.scrollLeft;
        return;
      }

      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth === 0) return;

      const scrollLeft = container.scrollLeft;
      const scrollDirection =
        scrollLeft > lastScrollLeftRef.current ? "right" : "left";
      const containerWidth = container.clientWidth;
      const threshold =
        containerWidth * PRODUCTS_CAROUSEL_CONFIG.repositionThreshold;

      // Repositionner avant d'atteindre la fin de la deuxième série
      if (scrollLeft >= singleSetWidth * 2 - threshold) {
        const offset = scrollLeft - (singleSetWidth * 2 - threshold);
        repositionScroll(container, singleSetWidth + offset);
      }
      // Repositionner avant d'atteindre le début de la deuxième série (scroll vers la gauche)
      else if (
        scrollLeft <= singleSetWidth + threshold &&
        scrollDirection === "left"
      ) {
        const offset = scrollLeft - (singleSetWidth + threshold);
        repositionScroll(container, singleSetWidth * 2 - threshold + offset);
      }

      lastScrollLeftRef.current = scrollLeft;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [catalog.length, getSingleSetWidth, repositionScroll]);

  /**
   * Fait défiler le carrousel manuellement dans une direction donnée
   *
   * @param dir - Direction du défilement ('left' ou 'right')
   */
  const scrollBy = useCallback((dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount =
      container.clientWidth * PRODUCTS_CAROUSEL_CONFIG.scrollAmount;
    container.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  /**
   * Fait défiler automatiquement le carrousel vers la droite
   * Gère le repositionnement invisible avant d'atteindre les limites
   */
  const autoScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isPaused || catalog.length === 0) return;

    const singleSetWidth = getSingleSetWidth();
    if (singleSetWidth === 0) return;

    const currentScroll = container.scrollLeft;
    const scrollAmount =
      container.clientWidth * PRODUCTS_CAROUSEL_CONFIG.scrollAmount;
    const containerWidth = container.clientWidth;
    const threshold =
      containerWidth * PRODUCTS_CAROUSEL_CONFIG.repositionThreshold;

    // Si on approche de la fin, repositionner d'abord de manière invisible
    if (currentScroll >= singleSetWidth * 2 - threshold) {
      const offset = currentScroll - (singleSetWidth * 2 - threshold);
      isScrollingRef.current = true;
      container.style.scrollBehavior = "auto";
      container.scrollLeft = singleSetWidth + offset;

      requestAnimationFrame(() => {
        if (container) {
          container.style.scrollBehavior = "";
          // Continuer le scroll après repositionnement
          requestAnimationFrame(() => {
            if (container && !isPaused) {
              container.scrollBy({ left: scrollAmount, behavior: "smooth" });
              isScrollingRef.current = false;
            }
          });
        }
      });
    } else {
      // Défiler normalement vers la droite
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, [isPaused, catalog.length, getSingleSetWidth]);

  /**
   * Démarre le défilement automatique
   */
  useEffect(() => {
    if (catalog.length === 0) return;

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      autoScrollIntervalRef.current = setInterval(
        autoScroll,
        PRODUCTS_CAROUSEL_CONFIG.autoScrollInterval
      );
    };

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [autoScroll, catalog.length]);

  /**
   * Gère la pause du défilement automatique au survol
   */
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  /**
   * Reprend le défilement automatique après le survol
   */
  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    autoScrollIntervalRef.current = setInterval(
      autoScroll,
      PRODUCTS_CAROUSEL_CONFIG.autoScrollInterval
    );
  }, [autoScroll]);

  return {
    scrollRef,
    duplicatedCatalog,
    isPaused,
    scrollBy,
    handleMouseEnter,
    handleMouseLeave,
  };
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

/**
 * Page d'accueil principale
 * Affiche plusieurs sections : carrousel, présentation, produits, statistiques, etc.
 */
export default function Home() {
  // Récupération des données dynamiques
  const { data: carouselItems = [], isLoading: isLoadingCarousel, isError: isErrorCarousel } = useCarouselItems();
  const { data: partnersData = [], isLoading: isLoadingPartners } = usePartners();
  const { data: polesData = [], isLoading: isLoadingPoles } = usePoles();
  const { data: recentEvents = [], isLoading: isLoadingEvents } = useRecentEvents();
  const { data: reviews = [], isLoading: isLoadingReviews } = useReviews();
  const { data: statistics = [], isLoading: isLoadingStatistics } = useStatistics();
  const { data: volunteers = [], isLoading: isLoadingVolunteers } = useVolunteers();
  const { data: featuredProducts = [], isLoading: isLoadingProducts } = useFeaturedProducts();

  const { add } = useCart();
  const router = useRouter();

  // Données par défaut pour le carrousel si l'API ne retourne rien
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
    // Utiliser les données de l'API si disponibles, sinon les données par défaut
    const itemsToUse = carouselItems.length > 0 ? carouselItems : defaultCarouselItems;
    const transformed = itemsToUse.map((item: any) => ({
      id: typeof item.id === 'string' ? parseInt(item.id) || 0 : (item.id || 0),
      image: item.image || '',
      title: item.title || '',
      description: item.description || '',
    }));
    return transformed;
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
    return featuredProducts.map((product: any) => {
      const hasDiscount = product.discountActive && product.discountPercent > 0;
      const effectivePrice = hasDiscount
        ? Math.round(product.price * (1 - product.discountPercent / 100))
        : product.price;
      return {
        id: product.id,
        name: product.title ?? "",
        image: product.imageId
          ? `https://res.cloudinary.com/df3ymbrqe/image/upload/w_600,h_600,c_fill,q_auto,f_auto/${product.imageId}`
          : "",
        price: effectivePrice,
        originalPrice: hasDiscount ? product.price : undefined,
        discount: hasDiscount ? product.discountPercent : undefined,
        description: product.description,
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

  // Utilisation du hook personnalisé pour gérer le carrousel circulaire
  const {
    scrollRef,
    duplicatedCatalog,
    scrollBy,
    handleMouseEnter,
    handleMouseLeave,
  } = useInfiniteCarousel(transformedProducts);

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
              className="shadow-2xl rounded-xl overflow-hidden"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PartnersCarousel
              partners={transformedPartners}
              {...CAROUSEL_CONFIG}
              showArrows={true}
              title="Nos Partenaires de Confiance"
              className="bg-white"
            />
          </div>
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
                  id: parseInt(event.id) || idx + 1,
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  image: event.image,
                  video: event.video,
                  location: event.location,
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
          <section className="w-full py-10 sm:py-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent">
                Nos Produits
              </h2>
              <div className="mt-3 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full" />
              <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4">
                Découvrez notre sélection d&apos;articles pour soutenir
                l&apos;association tout en vous faisant plaisir. Chaque achat
                contribue directement à nos actions locales et solidaires.
              </p>
            </div>

            <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex gap-5 sm:gap-6 py-4 ${
                transformedProducts.length <= 4
                  ? "justify-center flex-wrap"
                  : "overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              }`}>
                {transformedProducts.map((p) => (
                  <div key={p.id} className="snap-start shrink-0 w-[340px] self-stretch">
                    <ProductCard product={p} onAdd={handleOrder} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {/* Section Témoignages */}
      {isLoadingReviews ? (
        <ReviewsSectionSkeleton />
      ) : (
        <ReviewsSection reviews={reviews} />
      )}

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
          <VolunteersSection />
        )}
        
        {/* Slogan GAM - Remplacé complètement par le skeleton pendant le chargement initial */}
        {isInitialLoading ? (
          <GAMSloganSkeleton />
        ) : (
          <GAMSlogan />
        )}
      </div>
    </div>
  );
}
