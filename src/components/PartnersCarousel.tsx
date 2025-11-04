"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Partner {
  id: number;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  category?: string;
}

interface PartnersCarouselProps {
  partners: Partner[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  enableSwipe?: boolean;
  loop?: boolean;
  slidesToShow?: number;
  className?: string;
  title?: string;
}

export default function PartnersCarousel({
  partners,
  autoPlay = true,
  interval = 4000,
  showDots = true,
  showArrows = true,
  enableSwipe = true,
  loop = true,
  slidesToShow = 3,
  className = "",
  title = "Nos Partenaires",
}: PartnersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Gestion sécurisée des partenaires
  const safePartners = partners?.length > 0 ? partners : [];
  const totalPartners = safePartners.length;

  // Responsive slidesToShow avec gestion de l'hydratation
  const getResponsiveSlidesToShow = () => {
    if (!isClient) return slidesToShow; // Valeur par défaut pendant l'hydratation

    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return slidesToShow;
    }
    return slidesToShow;
  };

  const [responsiveSlidesToShow, setResponsiveSlidesToShow] =
    useState(slidesToShow);

  useEffect(() => {
    setIsClient(true);
    setResponsiveSlidesToShow(getResponsiveSlidesToShow());
  }, [slidesToShow]);

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      setResponsiveSlidesToShow(getResponsiveSlidesToShow());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slidesToShow, isClient]);

  // Calcul du nombre de slides disponibles (pour navigation par groupe)
  const maxSlides = Math.max(0, totalPartners - responsiveSlidesToShow + 1);

  const nextSlide = useCallback(() => {
    if (totalPartners === 0) return;

    setDirection(1);
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev + 1) % totalPartners;
      }
      return prev < totalPartners - 1 ? prev + 1 : prev;
    });
  }, [totalPartners, loop]);

  const prevSlide = useCallback(() => {
    if (totalPartners === 0) return;

    setDirection(-1);
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev - 1 + totalPartners) % totalPartners;
      }
      return prev > 0 ? prev - 1 : prev;
    });
  }, [totalPartners, loop]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalPartners) return;

      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, totalPartners]
  );

  // Gestion du timer d'autoplay
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPlaying && !isPaused && totalPartners > 1) {
      timerRef.current = setInterval(nextSlide, interval);
    }
  }, [isPlaying, isPaused, interval, nextSlide, totalPartners]);

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

  // Protection si pas de partenaires
  if (totalPartners === 0) {
    return (
      <div className={`relative w-full py-16 ${className}`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">{title}</h2>
          <p className="text-muted-foreground">Aucun partenaire à afficher</p>
        </div>
      </div>
    );
  }

  // Calculer la largeur d'une card (en pourcentage) avec gestion de l'hydratation
  const cardWidth = isClient && isMobile ? 100 : 40 / responsiveSlidesToShow;

  // Calculer le décalage pour le mouvement horizontal
  const translateX = -(currentIndex * cardWidth);

  // Créer un tableau étendu pour la boucle infinie
  const extendedPartners = loop
    ? [...safePartners, ...safePartners.slice(0, responsiveSlidesToShow)]
    : safePartners;

  return (
    <div
      className={`relative w-full py-6 bg-white/50 backdrop-blur-lg border border-gray-200 ${className}`}
    >
      {/* Titre de la section */}
      <div className="text-center mb-5">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-3xl font-bold bg-gradient-to-r from-theme-red via-theme-yellow to-theme-green bg-clip-text text-transparent mb-4"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-24 h-1 bg-gradient-to-r from-theme-red to-theme-green mx-auto rounded-full"
        />
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cards Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="flex"
            animate={{
              x: `${translateX}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.6,
            }}
            style={{
              width:
                isClient && isMobile
                  ? "100%"
                  : `${
                      (extendedPartners.length * 100) / responsiveSlidesToShow
                    }%`,
            }}
          >
            {extendedPartners.map((partner, index) => (
              <motion.div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 px-3"
                style={{
                  width: `${cardWidth}%`,
                  opacity: isClient ? 1 : 0, // Masquer pendant l'hydratation
                }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: isClient ? 1 : 0, y: 0, scale: 1 }}
                transition={{ delay: (index % responsiveSlidesToShow) * 0.1 }}
                onMouseEnter={() => setHoveredCard(partner.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className="h-80 my-5 group hover:shadow-xl transition-all duration-500 bg-white border-gray-200 hover:border-theme-red/30 overflow-hidden">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Logo Container */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-theme-red/5 group-hover:to-theme-yellow/5 transition-all duration-500 flex items-center justify-center p-6">
                      <div className="relative w-full h-full">
                        <Image
                          src={partner.logo}
                          alt={`Logo ${partner.name}`}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>

                      {/* Overlay avec effet de hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Category Badge */}
                      {partner.category && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {partner.category}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-theme-red transition-colors duration-300">
                          {partner.name}
                        </h3>
                        {partner.description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {partner.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dots Indicator */}
        {showDots && totalPartners > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {safePartners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex % totalPartners
                    ? "w-12 h-3 bg-gradient-to-r from-theme-red to-theme-yellow"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:cursor-pointer"
                }`}
                aria-label={`Aller au partenaire ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
