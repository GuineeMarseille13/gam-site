"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useExpandedYears } from "../_hooks/useExpandedYears"
import { getSortedYears, getTotalEvents } from "../_utils/events.utils"
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "../_config/events.config"
import EventsHero from "@/components/events/EventsHero"
import StatCard from "@/components/events/StatCard"
import YearSection from "@/components/events/YearSection"
import type { EventsByYear } from "@/types/events"

export function EventsClient({ eventsData }: { eventsData: EventsByYear }) {
  const isMobile = useIsMobile()
  const years = useMemo(() => getSortedYears(eventsData), [eventsData])
  const totalEvents = useMemo(() => getTotalEvents(eventsData), [eventsData])
  const { toggleYear, isExpanded } = useExpandedYears(years.length > 0 ? [years[0]] : [])

  return (
    <div className={STYLE_CONFIG.container}>
      <EventsHero />

      <motion.div
        {...ANIMATION_CONFIG.stats.container}
        className={STYLE_CONFIG.stats.grid}
      >
        <StatCard value={totalEvents} label={MESSAGES.stats.eventsLabel(totalEvents)} index={0} />
        <StatCard value={years.length} label={MESSAGES.stats.yearsLabel(years.length)} index={1} />
      </motion.div>

      <div>
        {years.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={STYLE_CONFIG.emptyState.wrapper}
          >
            <p className={STYLE_CONFIG.emptyState.message}>{MESSAGES.emptyState}</p>
          </motion.div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {years.map((year, index) => (
              <YearSection
                key={year}
                year={year}
                events={eventsData[year]}
                isExpanded={isExpanded(year)}
                onToggle={() => toggleYear(year)}
                isMobile={isMobile}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
