"use client";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface CarouselItem {
  id: number;
  image: string;
  title?: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  enableSwipe?: boolean;
  loop?: boolean;
  className?: string;
}

export default function Carousel({
  items,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = false,
  enableSwipe = false,
  loop = true,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion sécurisée des indices
  const safeItems = items?.length > 0 ? items : [];
  const totalItems = safeItems.length;

  const nextSlide = useCallback(() => {
    if (totalItems === 0) return;

    setDirection(1);
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev + 1) % totalItems;
      }
      return prev < totalItems - 1 ? prev + 1 : prev;
    });
  }, [totalItems, loop]);

  const prevSlide = useCallback(() => {
    if (totalItems === 0) return;

    setDirection(-1);
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev - 1 + totalItems) % totalItems;
      }
      return prev > 0 ? prev - 1 : prev;
    });
  }, [totalItems, loop]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalItems) return;

      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, totalItems]
  );

  // Gestion optimisée du timer d'autoplay
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPlaying && !isPaused && totalItems > 1) {
      timerRef.current = setInterval(nextSlide, interval);
    }
  }, [isPlaying, isPaused, interval, nextSlide, totalItems]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Gestion du swipe tactile améliorée
  const handleDragEnd = (
    event: MouseEvent | PointerEvent | TouchEvent,
    info: PanInfo
  ) => {
    if (!enableSwipe) return;

    const threshold = 50;
    const velocity = Math.abs(info.velocity.x);

    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      if (info.offset.x > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  };

  // Démarrage/arrêt du timer
  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // Pause intelligente au survol
  const handleMouseEnter = () => {
    setIsPaused(true);
    stopTimer();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimer();
  };

  // Protection si pas d'items
  if (totalItems === 0) {
    return (
      <div
        className={`relative w-full h-96 md:h-[500px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">Aucune image à afficher</p>
      </div>
    );
  }

  const currentItem = safeItems[currentIndex];

  return (
    <div
      className={`relative w-full max-w-7xl mx-auto h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden rounded-xl bg-gray-900 group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Images Container avec dégradés modernes */}
      <div className="relative h-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction > 0 ? 300 : -300,
              scale: 1.1,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -300 : 300,
              scale: 0.9,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="absolute inset-0"
            drag={enableSwipe ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={0.1}
          >
            <Image
              src={currentItem.image}
              alt={currentItem.title || `Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover select-none"
              width={1200}
              height={600}
              priority={currentIndex === 0}
              loading={currentIndex === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Dégradés modernes et doux sur les 4 côtés */}

            {/* Dégradé du haut - Effet vignette très subtil */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 via-black/5 to-transparent pointer-events-none" />

            {/* Dégradé du bas - Principal pour le contenu avec transition douce */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 via-black/30 via-black/10 to-transparent pointer-events-none" />

            {/* Dégradé gauche - Plus doux pour les contrôles */}
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black/15 via-black/5 to-transparent pointer-events-none" />

            {/* Dégradé droite - Équilibre visuel avec transition */}
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-black/15 via-black/5 to-transparent pointer-events-none" />

            {/* Overlay central subtil pour unifier l'image */}
            <div className="absolute inset-0 bg-gradient-to-br from-theme-red/5 via-transparent via-theme-yellow/3 to-theme-green/5 pointer-events-none" />

            {/* Overlay avec contenu amélioré */}
            {(currentItem.title || currentItem.description) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10"
              >
                {currentItem.title && (
                  <h3 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-2xl leading-tight">
                    {currentItem.title}
                  </h3>
                )}
                {currentItem.description && (
                  <p className="text-sm md:text-lg opacity-95 max-w-3xl drop-shadow-lg leading-relaxed">
                    {currentItem.description}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows améliorées */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={!loop && currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md border border-white/20 rounded-full p-3 transition-all duration-300 opacity-60 hover:opacity-100 group-hover:opacity-100 hover:scale-110"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
          </button>

          <button
            onClick={nextSlide}
            disabled={!loop && currentIndex === totalItems - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md border border-white/20 rounded-full p-3 transition-all duration-300 opacity-60 hover:opacity-100 group-hover:opacity-100 hover:scale-110"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
          </button>
        </>
      )}

      {/* Dots Indicator modernisés */}
      {showDots && totalItems > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 z-10">
          {safeItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "w-16 h-4 bg-white rounded-full scale-110"
                  : "w-4 h-4 bg-white/50 hover:bg-white/70 rounded-full hover:scale-110"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar harmonisée avec le thème */}
      {isPlaying && !isPaused && totalItems > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-theme-red via-theme-yellow to-theme-green"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: interval / 1000, ease: "linear" }}
            key={`${currentIndex}-${isPlaying}`}
          />
        </div>
      )}

      {/* Indicateur de slide actuel */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-white text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        {currentIndex + 1} / {totalItems}
      </div>
    </div>
  );
}
