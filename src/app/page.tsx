"use client";

import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import Carousel from "@/components/carousel";
import GAMSlogan from "@/components/GAMSlogan";
import PresentationSection from "@/components/PresentationSection";
import PoleSection from "@/components/PoleSection";
import ReviewsSection from "@/components/ReviewsSection";
import StatisticsSection from "@/components/StatisticsSection";
import VolunteersSection from "@/components/VolunteersSection";
import FloatingElementsAnimation from "@/components/FloatingElementsAnimation";
import PartnersCarousel from "@/components/PartnersCarousel";
import { ProductCard } from "@/app/boutique/_components/product-card";
import { getCatalog } from "@/app/boutique/_services/products";
import { useCart } from "@/app/boutique/_hooks/use-cart";

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
 * Éléments du carrousel principal de la page d'accueil
 */
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

/**
 * Données des partenaires pour le carrousel
 */
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

// ============================================================================
// HOOK PERSONNALISÉ : Gestion du carrousel circulaire infini
// ============================================================================

/**
 * Hook personnalisé pour gérer le carrousel circulaire infini
 *
 * @param catalog - Liste des produits à afficher
 * @returns Objet contenant les refs, états et fonctions nécessaires au carrousel
 */
function useInfiniteCarousel(catalog: ReturnType<typeof getCatalog>) {
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
  // Récupération du catalogue de produits
  const catalog = useMemo(() => getCatalog(), []);
  const { add } = useCart();

  // Utilisation du hook personnalisé pour gérer le carrousel circulaire
  const {
    scrollRef,
    duplicatedCatalog,
    scrollBy,
    handleMouseEnter,
    handleMouseLeave,
  } = useInfiniteCarousel(catalog);

  return (
    <div className="font-sans min-h-screen relative space-y-12 md:space-y-16">
      {/* Animation d'éléments flottants */}
      <FloatingElementsAnimation
        elements={floatingElements}
        {...FLOATING_ELEMENTS_CONFIG}
      />

      {/* Carrousel principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          items={carouselItems}
          {...CAROUSEL_CONFIG}
          className="shadow-2xl rounded-xl overflow-hidden"
        />
      </div>
      <PresentationSection />
      <PoleSection />

      {/* Carrousel des partenaires */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PartnersCarousel
          partners={partnersData}
          {...CAROUSEL_CONFIG}
          showArrows={true}
          title="Nos Partenaires de Confiance"
          className="bg-white"
        />
      </div>

      <ReviewsSection />

      {/* Section Produits - carrousel + description */}
      <section className="w-full">
        <div className="text-center sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent">
            Nos Produits
          </h2>
          <div className="mt-3 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full" />
          <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4">
            Découvrez notre sélection d’articles pour soutenir l’association
            tout en vous faisant plaisir. Chaque achat contribue directement à
            nos actions locales et solidaires.
          </p>
        </div>

        {/* Carrousel de produits (avec ProductCard) */}
        <div
          className="relative max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* <button
            aria-label="Précédent"
            onClick={() => scrollBy("left")}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center hover:bg-gray-50"
          >
            ‹
          </button> */}
          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {duplicatedCatalog.map((p, index) => (
              <div
                key={`${p.id}-${index}`}
                className="snap-start shrink-0 w-[320px] sm:w-[360px]"
              >
                <ProductCard
                  product={p}
                  onAdd={(prod) => add({ product: prod, quantity: 1 })}
                />
              </div>
            ))}
          </div>
          {/* <button
            aria-label="Suivant"
            onClick={() => scrollBy("right")}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center hover:bg-gray-50"
          >
            ›
          </button> */}
        </div>
      </section>
      <StatisticsSection />
      <div className="-my-12 md:-my-16">
        <VolunteersSection />
      </div>
      <GAMSlogan />
    </div>
  );
}
