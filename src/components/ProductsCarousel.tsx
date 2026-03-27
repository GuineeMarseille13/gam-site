"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Eye, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description?: string;
  category?: string;
  inStock?: boolean;
  featured?: boolean;
  discount?: number;
}

interface ProductsCarouselProps {
  products: Product[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  enableSwipe?: boolean;
  loop?: boolean;
  className?: string;
  title?: string;
  onAddToCart?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
}

export default function ProductsCarousel({
  products,
  autoPlay = true,
  interval = 4000,
  showDots = true,
  enableSwipe = true,
  loop = true,
  className = "",
  title = "Nos Produits",
  onAddToCart,
  onViewProduct,
}: ProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(autoPlay);
  const [, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [, setHoveredCard] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Gestion sécurisée des produits
  const safeProducts = products?.length > 0 ? products : [];
  const totalProducts = safeProducts.length;

  // Responsive slidesToShow basé sur la largeur du conteneur (fluide)
  const [responsiveSlidesToShow, setResponsiveSlidesToShow] = useState(3);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = (width: number) => {
      // Cartes ~280px min, max 8 sur très grands écrans
      const computed = Math.max(1, Math.min(8, Math.floor(width / 280)));
      setResponsiveSlidesToShow(computed);
    };
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) compute(entry.contentRect.width);
    });
    ro.observe(el);
    compute(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Utiliser des valeurs SSR-stables avant mount
  const effectiveSlidesToShow = isMounted ? responsiveSlidesToShow : 3;

  // Calculer la largeur d'une card (en pourcentage) - ajusté pour mobile
  const cardWidth = isMounted && isMobile ? 100 : 40 / effectiveSlidesToShow;

  // Calculer le décalage pour le mouvement horizontal
  const translateX = -(currentIndex * cardWidth);

  // Créer un tableau étendu pour la boucle infinie
  const extendedProducts = loop
    ? [...safeProducts, ...safeProducts.slice(0, effectiveSlidesToShow)]
    : safeProducts;

  const nextSlide = useCallback(() => {
    if (totalProducts === 0) return;

    setDirection(1);
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev + 1) % totalProducts;
      }
      return prev < totalProducts - 1 ? prev + 1 : prev;
    });
  }, [totalProducts, loop]);

  const prevSlide = useCallback(() => {
    if (totalProducts === 0) return;

    setDirection(-1);
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev - 1 + totalProducts) % totalProducts;
      }
      return prev > 0 ? prev - 1 : prev;
    });
  }, [totalProducts, loop]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalProducts) return;

      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, totalProducts]
  );

  // Gestion du timer d'autoplay
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPlaying && !isPaused && totalProducts > 1) {
      timerRef.current = setInterval(nextSlide, interval);
    }
  }, [isPlaying, isPaused, interval, nextSlide, totalProducts]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Démarrage/arrêt du timer
  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // Pause au survol
  const handleMouseEnter = () => {
    setIsPaused(true);
    stopTimer();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimer();
  };

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Protection si pas de produits
  if (totalProducts === 0) {
    return (
      <div className={`relative w-full py-16 ${className}`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">{title}</h2>
          <p className="text-muted-foreground">Aucun produit à afficher</p>
        </div>
      </div>
    );
  }

  // Gestion du swipe pour mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!enableSwipe || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div
      className={`relative w-full py-4 md:py-6 bg-gradient-to-br from-white via-gray-50/30 to-white border border-gray-200/50 ${className}`}
    >
      {/* Titre de la section */}
      <div className="text-center mb-6 md:mb-8 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-theme-red via-theme-yellow to-theme-green bg-clip-text text-transparent mb-4"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-16 md:w-24 h-1 bg-gradient-to-r from-theme-red to-theme-green mx-auto rounded-full"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm md:text-base px-4"
        >
          Découvrez nos produits artisanaux et soutenez notre association
        </motion.p>
      </div>

      {/* Carousel Container */}
      <div ref={containerRef} className="relative max-w-[100rem] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Cards Container */}
        <div
          className={`relative overflow-hidden ${isMobile ? "" : ""}`}
          onMouseEnter={!isMobile ? handleMouseEnter : undefined}
          onMouseLeave={!isMobile ? handleMouseLeave : undefined}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            className="flex"
            animate={{
              x: `${translateX}%`,
            }}
            transition={{
              type: "spring",
              stiffness: isMobile ? 400 : 300,
              damping: isMobile ? 40 : 30,
              duration: isMobile ? 0.4 : 0.6,
            }}
            style={{
              width:
                isMounted && isMobile
                  ? "100%"
                  : `${(extendedProducts.length * 100) / effectiveSlidesToShow}%`,
            }}
          >
            {extendedProducts.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                className={`flex-shrink-0 ${isMobile ? "px-2" : "px-3"}`}
                style={{ width: `${cardWidth}%` }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: (index % responsiveSlidesToShow) * 0.1 }}
                onMouseEnter={() => !isMobile && setHoveredCard(product.id)}
                onMouseLeave={() => !isMobile && setHoveredCard(null)}
              >
                <Card
                  className={`${
                    isMobile ? "h-80" : "h-96"
                  } my-3 md:my-5 group hover:shadow-xl transition-all duration-500 bg-white border-gray-200 hover:border-theme-red/30 overflow-hidden relative`}
                >
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Image Container */}
                    <div
                      className={`relative ${
                        isMobile ? "h-36" : "h-48"
                      } bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-theme-red/5 group-hover:to-theme-yellow/5 transition-all duration-500 overflow-hidden`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Overlay avec actions - simplifié sur mobile */}
                      {!isMobile && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onViewProduct?.(product)}
                              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors duration-300"
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Badges - repositionnés pour mobile */}
                      <div
                        className={`absolute ${
                          isMobile
                            ? "top-2 left-2 right-2"
                            : "top-3 left-3 right-3"
                        } flex justify-between items-start flex-wrap gap-1`}
                      >
                        {product.featured && (
                          <span
                            className={`bg-theme-red text-white ${
                              isMobile
                                ? "px-1.5 py-0.5 text-xs"
                                : "px-2 py-1 text-xs"
                            } rounded-full font-medium`}
                          >
                            {isMobile ? "Top" : "Coup de cœur"}
                          </span>
                        )}
                        {product.discount && (
                          <span
                            className={`bg-theme-green text-white ${
                              isMobile
                                ? "px-1.5 py-0.5 text-xs"
                                : "px-2 py-1 text-xs"
                            } rounded-full font-medium`}
                          >
                            -{product.discount}%
                          </span>
                        )}
                        {!product.inStock && (
                          <span
                            className={`bg-gray-500 text-white ${
                              isMobile
                                ? "px-1.5 py-0.5 text-xs"
                                : "px-2 py-1 text-xs"
                            } rounded-full font-medium ml-auto`}
                          >
                            Épuisé
                          </span>
                        )}
                      </div>

                      {/* Category Badge - masqué sur très petits écrans */}
                      {product.category && !isMobile && (
                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                          {product.category}
                        </div>
                      )}
                    </div>

                    {/* Content - ajusté pour mobile */}
                    <div
                      className={`flex-1 ${
                        isMobile ? "p-3" : "p-4"
                      } flex flex-col`}
                    >
                      <div className="flex-1">
                        <h3
                          className={`${
                            isMobile ? "text-base" : "text-lg"
                          } font-bold text-gray-900 mb-2 group-hover:text-theme-red transition-colors duration-300 line-clamp-2`}
                        >
                          {product.name}
                        </h3>
                        {product.description && !isMobile && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                            {product.description}
                          </p>
                        )}
                      </div>

                      {/* Prix et actions - optimisé pour mobile */}
                      <div className="mt-auto">
                        <div
                          className={`flex items-center justify-between ${
                            isMobile ? "mb-2" : "mb-3"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={`${
                                isMobile ? "text-lg" : "text-xl"
                              } font-bold text-theme-red`}
                            >
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: isMobile ? 1 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onAddToCart?.(product)}
                          disabled={!product.inStock}
                          className={`w-full flex items-center justify-center space-x-2 ${
                            isMobile ? "py-2 px-3 text-sm" : "py-2 px-4"
                          } rounded-lg font-medium transition-all duration-300 ${
                            product.inStock
                              ? "bg-gradient-to-r from-theme-red to-theme-yellow text-white hover:shadow-lg hover:from-theme-red-dark hover:to-theme-yellow-dark"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingBag
                            className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                          />
                          <span>
                            {product.inStock ? "Commander" : "Épuisé"}
                          </span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-theme-red via-theme-yellow to-theme-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dots Indicator - ajusté pour mobile */}
        {showDots && totalProducts > 1 && (
          <div
            className={`flex justify-center ${
              isMobile ? "mt-4" : "mt-8"
            } space-x-2`}
          >
            {safeProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex % totalProducts
                    ? `${
                        isMobile ? "w-8 h-2" : "w-12 h-3"
                      } bg-gradient-to-r from-theme-red to-theme-yellow`
                    : `${
                        isMobile ? "w-2 h-2" : "w-3 h-3"
                      } bg-gray-300 hover:bg-gray-400 hover:cursor-pointer`
                }`}
                aria-label={`Aller au produit ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
