"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { PartnerCard } from "@/components/partner-card";
import { SectionSplitHeading } from "@/components/section-split-heading";
import { useCarouselSlideLayout } from "@/hooks/use-carousel-slide-layout";
import {
  buildLoopedCatalog,
  useInfiniteHorizontalCarousel,
} from "@/hooks/use-infinite-horizontal-carousel";

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

const PARTNERS_INTRO =
  "Nous collaborons avec des partenaires de confiance qui partagent nos valeurs et notre engagement en faveur de la communauté guinéenne à Marseille. Ensemble, nous œuvrons pour l\u2019intégration, le développement et l\u2019épanouissement de tous.";

/** Largeurs cartes partenaires : plus généreuses que le carousel par défaut (meilleure lecture des descriptions). */
const PARTNER_CAROUSEL_LAYOUT = {
  minCardWidth: 340,
  maxCardWidth: 460,
} as const;

/**
 * Section d'accueil : partenaires en carrousel horizontal infini (défilement circulaire).
 */
export default function PartnersCarousel({
  partners,
  autoPlay = true,
  interval = 4000,
  showArrows = true,
  className = "",
  title = "Nos Partenaires",
}: PartnersCarouselProps) {
  const safePartners = partners?.length > 0 ? partners : [];
  const totalPartners = safePartners.length;

  const { trackRef, layout } = useCarouselSlideLayout(PARTNER_CAROUSEL_LAYOUT);

  const canScroll = totalPartners > layout.slidesToShow;
  const displayPartners = canScroll
    ? buildLoopedCatalog(safePartners)
    : safePartners;
  const showControls = showArrows && canScroll;

  const { scrollRef, scrollBy, handleMouseEnter, handleMouseLeave, isLoopEnabled } =
    useInfiniteHorizontalCarousel(totalPartners, {
      autoScrollInterval: autoPlay && canScroll ? interval : 0,
      defaultGap: layout.gap,
      enabled: canScroll,
    });

  const setScrollTrackRef = (node: HTMLDivElement | null) => {
    trackRef.current = node;
    scrollRef.current = node;
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isLoopEnabled || layout.cardWidth <= 0) return;

    const singleSetWidth =
      totalPartners * (layout.cardWidth + layout.gap);

    container.scrollLeft = singleSetWidth;
  }, [
    layout.cardWidth,
    layout.gap,
    totalPartners,
    isLoopEnabled,
    scrollRef,
  ]);

  if (totalPartners === 0) {
    return (
      <div className={`relative w-full py-10 md:py-12 ${className}`}>
        <div className="text-center">
          <SectionSplitHeading
            showAmbient={false}
            title={title}
            tone="partners"
          />
          <p className="mt-3 text-muted-foreground sm:mt-4">
            Aucun partenaire à afficher
          </p>
        </div>
      </div>
    );
  }

  const partnerKey = (partner: Partner, index: number) =>
    `partner-${partner.id}-${index}`;

  const snapClass = layout.isSingleSlide ? "snap-center" : "snap-start";

  return (
    <section
      className={`relative w-full overflow-hidden py-12 sm:py-14 md:py-16 bg-gradient-to-b from-white via-slate-50/40 to-white ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <SectionSplitHeading title={title} tone="partners" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:mt-5 sm:text-lg"
          >
            {PARTNERS_INTRO}
          </motion.p>
        </motion.div>
      </div>

      <div className="relative z-10 mt-8 sm:mt-10 md:mt-12">
        <div
          className="relative mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="group/carousel relative">
            {showControls ? (
              <button
                type="button"
                onClick={() => scrollBy("left")}
                aria-label="Partenaires précédents"
                className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 sm:flex size-11 lg:size-12 items-center justify-center rounded-full border border-border/80 bg-white/95 text-primary shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:border-primary/35 hover:bg-muted/90 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <ChevronLeft className="size-6" strokeWidth={2} />
              </button>
            ) : null}

            <div
              ref={setScrollTrackRef}
              className="overflow-x-auto touch-pan-y overscroll-x-contain snap-x snap-mandatory scroll-smooth py-4 sm:py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{
                scrollbarWidth: "none",
                scrollPaddingInline: `${layout.gutter}px`,
              }}
              {...(isLoopEnabled
                ? { "aria-roledescription": "carousel" as const }
                : {})}
            >
              <div
                className={`flex min-w-max ${canScroll ? "" : "w-full justify-center"}`}
                style={{
                  gap: layout.gap,
                  paddingInline: layout.gutter,
                }}
              >
                {displayPartners.map((partner, index) => (
                  <div
                    key={partnerKey(partner, index)}
                    className={`box-border shrink-0 grow-0 self-stretch py-2 ${snapClass}`}
                    style={{
                      width: layout.cardWidth,
                      minWidth: layout.cardWidth,
                      maxWidth: layout.cardWidth,
                    }}
                  >
                    <PartnerCard
                      disableHoverLift
                      id={partner.id}
                      name={partner.name}
                      logo={partner.logo}
                      description={partner.description}
                      website={partner.website}
                    />
                  </div>
                ))}
              </div>
            </div>

            {showControls ? (
              <button
                type="button"
                onClick={() => scrollBy("right")}
                aria-label="Partenaires suivants"
                className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 sm:flex size-11 lg:size-12 items-center justify-center rounded-full border border-border/80 bg-white/95 text-primary shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:border-primary/35 hover:bg-muted/90 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <ChevronRight className="size-6" strokeWidth={2} />
              </button>
            ) : null}

            {showControls ? (
              <div className="mt-4 flex justify-center gap-4 py-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => scrollBy("left")}
                  aria-label="Partenaires précédents"
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-border/80 bg-white text-primary shadow-md transition-colors hover:bg-muted/90 active:bg-muted"
                >
                  <ChevronLeft className="size-6" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy("right")}
                  aria-label="Partenaires suivants"
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-border/80 bg-white text-primary shadow-md transition-colors hover:bg-muted/90 active:bg-muted"
                >
                  <ChevronRight className="size-6" strokeWidth={2} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
