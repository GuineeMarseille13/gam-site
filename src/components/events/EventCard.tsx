"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import EventMediaPreview from "./EventMediaPreview";
import { Event } from "@/types/events";
import { ANIMATION_CONFIG, STYLE_CONFIG } from "@/app/(public)/evenements/_config/events.config";

interface EventCardProps {
  event: Event;
  isMobile?: boolean;
  index: number;
}

const EventCard = memo(function EventCard({
  event,
  index,
}: EventCardProps) {
  return (
    <motion.div
      initial={ANIMATION_CONFIG.eventCard.wrapper.initial}
      animate={ANIMATION_CONFIG.eventCard.wrapper.animate}
      transition={{
        ...ANIMATION_CONFIG.eventCard.wrapper.transition,
        delay: index * ANIMATION_CONFIG.eventCard.wrapper.delayMultiplier,
      }}
      whileHover={ANIMATION_CONFIG.eventCard.hover}
      className={STYLE_CONFIG.eventCard.wrapper}
    >
      {/* Date et Localisation */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className={STYLE_CONFIG.eventCard.badge}>
          {event.date}
        </span>
        {event.location && (
          <span className={STYLE_CONFIG.eventCard.location}>
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {event.location}
          </span>
        )}
      </div>

      {/* Titre */}
      <h3 className={STYLE_CONFIG.eventCard.title}>
        {event.title}
      </h3>

      {/* Description */}
      <p className={STYLE_CONFIG.eventCard.description}>
        {event.description}
      </p>

      {/* Preview image cliquable → lightbox */}
      {event.media && event.media.length > 0 && (
        <EventMediaPreview media={event.media} />
      )}
    </motion.div>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;

