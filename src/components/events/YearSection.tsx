"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import EventCard from "./EventCard";
import { Event } from "@/types/events";
import { ANIMATION_CONFIG, STYLE_CONFIG, MESSAGES } from "@/app/(public)/evenements/_config/events.config";

interface YearSectionProps {
  year: number;
  events: Event[];
  isExpanded: boolean;
  onToggle: () => void;
  isMobile: boolean;
  index: number;
}

const YearSection = memo(function YearSection({
  year,
  events,
  isExpanded,
  onToggle,
  isMobile,
  index,
}: YearSectionProps) {
  return (
    <motion.div
      initial={ANIMATION_CONFIG.yearSection.wrapper.initial}
      animate={ANIMATION_CONFIG.yearSection.wrapper.animate}
      transition={{
        ...ANIMATION_CONFIG.yearSection.wrapper.transition,
        delay: index * ANIMATION_CONFIG.yearSection.wrapper.delayMultiplier,
      }}
      className={STYLE_CONFIG.yearSection.wrapper}
    >
      <div className={STYLE_CONFIG.yearSection.inner}>
      {/* Header de l'année */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={STYLE_CONFIG.yearSection.button}
      >
        {/* Effet de brillance au survol */}
        <span className={STYLE_CONFIG.yearSection.shine} />
        
        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <motion.div
            animate={isExpanded ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={STYLE_CONFIG.yearSection.indicator}
          />
          <div className="text-left">
            <h2 className={STYLE_CONFIG.yearSection.year}>
              {year}
            </h2>
            <p className={STYLE_CONFIG.yearSection.count}>
              {MESSAGES.yearSection.eventCount(events.length)}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={ANIMATION_CONFIG.yearSection.chevron}
          className="flex-shrink-0 relative z-10"
        >
          <ChevronDown className={STYLE_CONFIG.yearSection.chevron} />
        </motion.div>
      </motion.button>

      {/* Contenu des événements */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            {...ANIMATION_CONFIG.yearSection.expand}
            className="overflow-hidden"
          >
            <motion.div
              {...ANIMATION_CONFIG.yearSection.content}
              className={STYLE_CONFIG.yearSection.content}
            >
              {events.map((event, eventIndex) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={eventIndex}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
});

YearSection.displayName = "YearSection";

export default YearSection;

