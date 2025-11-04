"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { PartnerCard } from "@/components/partner-card";
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
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Gestion sécurisée des partenaires
  const safePartners = partners?.length > 0 ? partners : [];
  const totalPartners = safePartners.length;

  // Responsive slidesToShow basé sur la largeur du conteneur (fluide)
  const [responsiveSlidesToShow, setResponsiveSlidesToShow] = useState(3);
  useEffect(() => {
    setIsClient(true);
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
    // Initial compute
    compute(el.clientWidth);
    return () => ro.disconnect();
  }, [isClient]);

  // Calcul du nombre de slides disponibles (pour navigation par groupe)
  const effectiveSlidesToShow = isMounted ? responsiveSlidesToShow : 3;
  const maxSlides = Math.max(0, totalPartners - effectiveSlidesToShow + 1);

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
  const cardWidth = isMounted && isMobile ? 100 : 40 / effectiveSlidesToShow;

  // Calculer le décalage pour le mouvement horizontal
  const translateX = -(currentIndex * cardWidth);

  // Créer un tableau étendu pour la boucle infinie
  const extendedPartners = loop
    ? [...safePartners, ...safePartners.slice(0, effectiveSlidesToShow)]
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
      <div ref={containerRef} className="relative max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
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
                isMounted && isMobile
                  ? "100%"
                  : `${(extendedPartners.length * 100) / effectiveSlidesToShow}%`,
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
                <PartnerCard
                  id={partner.id}
                  name={partner.name}
                  logo={partner.logo}
                  description={partner.description}
                  website={partner.website}
                />
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
