"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { PartnerCard } from "@/components/partner-card";
import { SectionSplitHeading } from "@/components/section-split-heading";

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

const GAP_PX = 40;
/** Largeur cible d’une carte (design desktop / max). */
const CARD_IDEAL_WIDTH_PX = 300;
/** En dessous, la carte est trop étroite : on affiche moins de colonnes. */
const CARD_MIN_WIDTH_PX = 280;
const TRACK_MIN_WIDTH_FALLBACK = 320;

function slidesToShowForTrackWidth(width: number): number {
  let slides = Math.max(
    1,
    Math.min(8, Math.floor(width / CARD_IDEAL_WIDTH_PX)),
  );
  while (slides > 1) {
    const slotWidth =
      (width - GAP_PX * (slides - 1)) / slides;
    if (slotWidth >= CARD_MIN_WIDTH_PX) {
      break;
    }
    slides -= 1;
  }
  return slides;
}

/**
 * Section d’accueil : partenaires en carrousel horizontal.
 * Sur mobile (une carte visible), la largeur de slide = largeur mesurée de la piste
 * pour qu’une étape fasse défiler exactement une carte entière.
 */
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
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const safePartners = partners?.length > 0 ? partners : [];
  const totalPartners = safePartners.length;

  const [responsiveSlidesToShow, setResponsiveSlidesToShow] = useState(1);

  useLayoutEffect(() => {
    setIsClient(true);
    const el = trackRef.current;
    if (!el) return;

    const compute = (width: number) => {
      setTrackWidth(width);
      setResponsiveSlidesToShow(slidesToShowForTrackWidth(width));
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        compute(entry.contentRect.width);
      }
    });

    ro.observe(el);
    compute(el.clientWidth);

    return () => ro.disconnect();
  }, []);

  const effectiveSlidesToShow = responsiveSlidesToShow;
  const effectiveTrackWidth =
    trackWidth > 0 ? trackWidth : TRACK_MIN_WIDTH_FALLBACK;

  const slideWidthPx =
    effectiveSlidesToShow <= 1
      ? effectiveTrackWidth
      : Math.min(
          CARD_IDEAL_WIDTH_PX,
          Math.floor(
            (effectiveTrackWidth -
              GAP_PX * (effectiveSlidesToShow - 1)) /
              effectiveSlidesToShow,
          ),
        );

  const slideStridePx = slideWidthPx + GAP_PX;

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

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
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

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    stopTimer();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimer();
  };

  if (totalPartners === 0) {
    return (
      <div className={`relative w-full py-10 md:py-12 ${className}`}>
        <div className="text-center">
          <SectionSplitHeading
            showAmbient={false}
            title={title}
            tone="partners"
          />
          <p className="mt-3 text-muted-foreground sm:mt-4">Aucun partenaire à afficher</p>
        </div>
      </div>
    );
  }

  const translateXPx =
    totalPartners > effectiveSlidesToShow
      ? -currentIndex * slideStridePx
      : 0;

  const extendedPartners =
    loop && totalPartners > effectiveSlidesToShow
      ? [...safePartners, ...safePartners.slice(0, effectiveSlidesToShow)]
      : safePartners;

  return (
    <section
      className={`relative w-full py-10 sm:py-12 md:py-14 bg-gradient-to-b from-white via-gray-50/50 to-white ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <SectionSplitHeading title={title} tone="partners" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto mt-3 max-w-3xl px-4 text-base text-gray-600 leading-relaxed sm:mt-4 sm:text-lg"
          >
            Nous collaborons avec des partenaires de confiance qui partagent nos valeurs
            et notre engagement en faveur de la communauté guinéenne à Marseille.
            Ensemble, nous œuvrons pour l&apos;intégration, le développement et
            l&apos;épanouissement de tous.
          </motion.p>
        </motion.div>

        <div className="relative max-w-[100rem] mx-auto px-0 sm:px-2 lg:px-4">
          <div
            ref={trackRef}
            className="relative w-full overflow-hidden px-3 py-8 sm:px-4 sm:py-10 md:py-12"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className={`flex ${totalPartners <= effectiveSlidesToShow ? "justify-center" : ""}`}
              style={{ gap: GAP_PX }}
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
                  className="box-border min-w-0 shrink-0 grow-0"
                  style={{
                    width: slideWidthPx,
                    minWidth: slideWidthPx,
                    maxWidth: slideWidthPx,
                    opacity: isClient ? 1 : 0,
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: isClient ? 1 : 0, y: 0, scale: 1 }}
                  transition={{
                    delay: (index % Math.max(responsiveSlidesToShow, 1)) * 0.1,
                  }}
                  onMouseEnter={() => setHoveredCard(partner.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <PartnerCard
                    disableHoverLift
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
        </div>
      </div>
    </section>
  );
}
