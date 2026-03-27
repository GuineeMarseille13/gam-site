"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { PartnerCard } from "@/components/partner-card";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Partner {
  id: number;
  name: string;
  logo?: string;
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
  loop = true,
  className = "",
  title = "Nos Partenaires",
}: PartnersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(autoPlay);
  const [, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [, setHoveredCard] = useState<number | null>(null);
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
      // Cartes ~300px min, max 8 sur très grands écrans
      const computed = Math.max(1, Math.min(8, Math.floor(width / 300)));
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

  // Gestion du timer d'autoplay
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Ne scroller que si les partenaires dépassent les slides visibles
    if (isPlaying && !isPaused && totalPartners > effectiveSlidesToShow) {
      timerRef.current = setInterval(nextSlide, interval);
    }
  }, [isPlaying, isPaused, interval, nextSlide, totalPartners, effectiveSlidesToShow]);

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
      <div className={`relative w-full py-10 md:py-12 ${className}`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">{title}</h2>
          <p className="text-muted-foreground">Aucun partenaire à afficher</p>
        </div>
      </div>
    );
  }

  // Largeur fixe d'une card (px) + gap (40px = gap-10)
  const cardWidthPx = isMounted && isMobile ? 300 : 300;
  const gapPx = 40;

  // Calculer le décalage en px
  const translateXPx = -(currentIndex * (cardWidthPx + gapPx));

  // Créer un tableau étendu pour la boucle infinie (seulement s'il y a plus de partenaires que de slides visibles)
  const extendedPartners = loop && totalPartners > effectiveSlidesToShow
    ? [...safePartners, ...safePartners.slice(0, effectiveSlidesToShow)]
    : safePartners;

  return (
    <section
      className={`relative w-full py-10 sm:py-12 md:py-14 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-x-hidden ${className}`}
    >
      {/* Effet de fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête de section amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            {title}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto px-4"
          >
            Nous collaborons avec des partenaires de confiance qui partagent nos valeurs
            et notre engagement en faveur de la communauté guinéenne à Marseille.
            Ensemble, nous œuvrons pour l&apos;intégration, le développement et
            l&apos;épanouissement de tous.
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="relative max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Cards Container avec espace pour le hover */}
          <div
            className="relative overflow-visible py-6 sm:py-8 md:py-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className={`flex gap-10 ${totalPartners <= effectiveSlidesToShow ? "justify-center" : ""}`}
              animate={{
                x: totalPartners > effectiveSlidesToShow ? translateXPx : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6,
              }}
            >
              {extendedPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 w-full max-w-[300px] sm:w-[280px] md:w-[300px]"
                  style={{
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

          {/* Dots Indicator amélioré */}
          {/* {showDots && totalPartners > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center items-center mt-10 sm:mt-12 gap-2 sm:gap-3"
            >
              {safePartners.map((partner, index) => {
                const isActive = index === currentIndex % totalPartners;
                return (
                  <motion.button
                    key={`partner-dot-${partner.id || index}`}
                    onClick={() => goToSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative transition-all duration-300 rounded-full ${
                      isActive
                        ? "w-12 h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-blue-200/50"
                        : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Aller au partenaire ${index + 1}`}
                  />
                );
              })}
            </motion.div>
          )} */}
        </div>
      </div>
    </section>
  );
}
