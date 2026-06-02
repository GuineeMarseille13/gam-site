"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";

import type { PermanenceSlotDisplay } from "@/helpers/administrative-permanence/build-pole-slots";
import { formatSlotRangeFr } from "@/helpers/administrative-permanence/format-hm-fr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TOOLTIP_COLLISION_PADDING = 16;
const DATES_GRID_COLUMNS = 3;

type NextPermanenceBadgeCorner = "top-right" | "top-left";

function resolveNextPermanenceBadgeCorner(
  dateIndex: number,
  columns: number = DATES_GRID_COLUMNS,
): NextPermanenceBadgeCorner {
  const column = dateIndex % columns;
  if (column === columns - 1) return "top-left";
  return "top-right";
}

const badgeCornerClassName: Record<NextPermanenceBadgeCorner, string> = {
  "top-right": "top-1.5 right-1.5",
  "top-left": "top-1.5 left-1.5",
};

interface NextPermanenceIconProps {
  corner: NextPermanenceBadgeCorner;
}

/** Badge « prochaine permanence » — ancré dans la tuile + tooltip en portail. */
function NextPermanenceIcon({ corner }: NextPermanenceIconProps) {
  return (
    <div
      className={`pointer-events-auto absolute z-30 ${badgeCornerClassName[corner]}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Prochaine permanence"
            className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-600 shadow-lg transition-colors duration-200 hover:bg-red-700 active:bg-red-800 sm:size-8"
            style={{
              boxShadow:
                "0 4px 14px rgba(239, 68, 68, 0.55), 0 0 0 2px rgba(255,255,255,0.9)",
            }}
          >
            <Info className="size-4 text-white sm:size-5" strokeWidth={3} aria-hidden />
            <motion.span
              className="pointer-events-none absolute -inset-1 rounded-full bg-red-500"
              aria-hidden
              animate={{
                opacity: [0.35, 0.65, 0.35],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={TOOLTIP_COLLISION_PADDING}
          className="max-w-[min(100vw-2rem,20rem)] border border-gray-700 bg-gray-900 px-4 py-2.5 text-center text-sm font-bold text-white shadow-2xl"
        >
          Prochaine permanence
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

interface PermanenceCalendarProps {
  slots: PermanenceSlotDisplay[];
  colorScheme: {
    primary: string;
  };
  /** Année affichée dans le titre (sinon déduite des dates). */
  calendarYear?: number;
}

export default function PermanenceCalendar({
  slots,
  colorScheme,
  calendarYear,
}: PermanenceCalendarProps) {
  const dates = useMemo(
    () =>
      [...slots.map((s) => s.date)].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [slots]
  );

  const timeByDate = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of slots) {
      m.set(s.date, formatSlotRangeFr(s.startTime, s.endTime));
    }
    return m;
  }, [slots]);

  const resolvedYearLabel = useMemo(() => {
    if (calendarYear != null) {
      return calendarYear;
    }
    if (dates.length === 0) {
      return new Date().getFullYear();
    }
    return Math.max(...dates.map((d) => new Date(d).getFullYear()));
  }, [calendarYear, dates]);

  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const weekday = date.toLocaleDateString("fr-FR", { weekday: "long" });
    return { day, month, weekday, date };
  };

  // Grouper les dates par mois
  const datesByMonth = dates.reduce((acc, dateStr) => {
    const date = new Date(dateStr);
    const monthKey = date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(dateStr);
    return acc;
  }, {} as Record<string, string[]>);

  // Trier les dates dans chaque mois
  Object.keys(datesByMonth).forEach((month) => {
    datesByMonth[month].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  });

  // Convertir en tableau pour la navigation
  const monthsArray = Object.entries(datesByMonth);
  const totalMonths = monthsArray.length;
  const monthsPerView = 3; // Nombre de mois à afficher à la fois

  // Trouver la prochaine permanence
  const getNextPermanence = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour la comparaison

    // Trouver la première date future
    const futureDates = dates
      .map((dateStr) => new Date(dateStr))
      .filter((date) => {
        date.setHours(0, 0, 0, 0);
        return date >= now;
      })
      .sort((a, b) => a.getTime() - b.getTime());

    return futureDates.length > 0 ? futureDates[0] : null;
  };

  const nextPermanence = getNextPermanence();

  // Calculer l'index initial pour afficher le mois de la prochaine permanence
  const getInitialIndex = () => {
    // Si pas de prochaine permanence, commencer au début
    if (!nextPermanence) {
      return 0;
    }

    const nextMonthKey = nextPermanence.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });

    // Trouver l'index du mois de la prochaine permanence
    const nextMonthIndex = monthsArray.findIndex(
      ([monthKey]) => monthKey === nextMonthKey
    );

    // Si le mois n'est pas trouvé, commencer au début
    if (nextMonthIndex === -1) {
      return 0;
    }

    // Ajuster pour afficher le trio qui contient le mois de la prochaine permanence
    const targetIndex = Math.max(
      0,
      Math.min(nextMonthIndex, totalMonths - monthsPerView)
    );

    return targetIndex;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

  // Calculer les mois à afficher (3 à la fois)
  const getVisibleMonths = () => {
    const start = currentIndex;
    const end = Math.min(totalMonths, start + monthsPerView);
    return monthsArray.slice(start, end);
  };

  const visibleMonths = getVisibleMonths();

  const goToMonth = (index: number) => {
    // Ajuster pour afficher le mois sélectionné et les suivants
    const targetIndex = Math.max(
      0,
      Math.min(index, totalMonths - monthsPerView)
    );
    setCurrentIndex(targetIndex);
  };

  return (
    <TooltipProvider delayDuration={200}>
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 overflow-visible md:mb-12"
    >
      <div className="text-center mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 mb-2"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-2.5 rounded-xl bg-gradient-to-br ${colorScheme.primary} text-white shadow-lg overflow-hidden`}
          >
            {/* Effet de brillance animé */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
              style={{ width: "50%" }}
            />
            <CalendarIcon className="w-5 h-5 relative z-10" />
            {/* Glow animé */}
            <motion.div
              className={`absolute -inset-1 bg-gradient-to-br ${colorScheme.primary} rounded-xl blur-md opacity-50`}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Calendrier des Permanences {resolvedYearLabel}
          </h2>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"
        />
      </div>

      {/* Sélecteur de mois (pills uniquement) */}
      {totalMonths > 3 && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {monthsArray.map(([month, monthDates], index) => {
            const isActive =
              index >= currentIndex && index < currentIndex + monthsPerView;
            const monthDate = new Date(monthDates[0] || dates[0]);

            // Vérifier si ce mois contient la prochaine permanence
            const containsNextPermanence =
              nextPermanence &&
              monthDates.some((dateStr) => {
                const date = new Date(dateStr);
                date.setHours(0, 0, 0, 0);
                return date.toDateString() === nextPermanence.toDateString();
              });

            return (
              <motion.button
                key={month}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToMonth(index)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all relative ${
                  isActive
                    ? `bg-gradient-to-br ${colorScheme.primary} text-white shadow-md`
                    : containsNextPermanence
                    ? "bg-emerald-50 border-2 border-emerald-300 text-emerald-700 hover:border-emerald-400 font-semibold"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {monthDate
                  .toLocaleDateString("fr-FR", { month: "short" })
                  .toUpperCase()}
                {containsNextPermanence && !isActive && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Grille responsive avec affichage optimisé */}
      <div className="grid grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleMonths.map(([month, monthDates], monthIndex) => (
            <motion.div
              key={`${month}-${currentIndex}-${monthIndex}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: monthIndex * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative overflow-visible rounded-3xl border border-gray-200/40 bg-white/95 p-5 shadow-xl backdrop-blur-md md:p-6"
              style={{
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
                aria-hidden
              >
                {/* Effet de brillance au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  style={{ width: "50%" }}
                />
                {/* Gradient animé en arrière-plan avec effet subtil */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${colorScheme.primary} opacity-0 transition-opacity duration-700 group-hover:opacity-[0.04]`}
                />
                {/* Bordure lumineuse au hover */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colorScheme.primary} opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-20`}
                />
              </div>
              {/* En-tête du mois avec style moderne */}
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-5 capitalize flex items-center gap-3">
                  <motion.span
                    className={`w-1.5 h-7 bg-gradient-to-b ${colorScheme.primary} rounded-full shadow-sm`}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <span className="tracking-tight">{month}</span>
                </h3>

                {/* Grille optimisée des dates avec design moderne */}
                <div className="relative grid grid-cols-3 gap-2.5 overflow-visible">
                  {monthDates.map((dateStr, index) => {
                    const { day, weekday, date } = formatDate(dateStr);
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);

                    const isPast = date < now;
                    const isToday = date.toDateString() === now.toDateString();
                    const isNextPermanence =
                      nextPermanence &&
                      date.toDateString() === nextPermanence.toDateString();

                    return (
                      <motion.div
                        key={dateStr}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.02,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ scale: 1.08, y: -3, rotate: 0.5 }}
                        className={`group/date relative rounded-2xl border p-3 transition-all duration-300 md:p-3.5 ${
                          isNextPermanence
                            ? "isolate z-[1] overflow-visible"
                            : "overflow-hidden"
                        } ${
                          isPast
                            ? "bg-gradient-to-br from-gray-50/60 to-gray-100/40 border-gray-200/40 opacity-60"
                            : isToday
                            ? `bg-gradient-to-br ${colorScheme.primary} border-transparent text-white shadow-2xl`
                            : isNextPermanence
                            ? `bg-gradient-to-br ${colorScheme.primary} border-transparent text-white shadow-2xl ring-4 ring-emerald-200/50`
                            : `bg-white/90 backdrop-blur-sm border-gray-200/50 hover:border-transparent hover:shadow-xl hover:bg-white`
                        }`}
                        style={{
                          boxShadow: isPast
                            ? "0 2px 8px rgba(0,0,0,0.04)"
                            : isToday
                            ? "0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)"
                            : isNextPermanence
                            ? "0 12px 32px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15), 0 0 0 4px rgba(16, 185, 129, 0.2)"
                            : "0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        {/* Effet de brillance pour les dates futures */}
                        {!isPast && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "200%" }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            style={{ width: "50%" }}
                          />
                        )}
                        {/* Effet de lumière subtil pour les dates futures */}
                        {!isPast && !isToday && !isNextPermanence && (
                          <motion.div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover/date:opacity-100 transition-opacity duration-500" />
                        )}

                        {/* Badge "Aujourd'hui" avec animation */}
                        {isToday && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 15,
                            }}
                            className="absolute -top-2 -right-2 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[10px] font-bold rounded-full text-gray-900 shadow-xl z-10 border border-white/50"
                            style={{
                              boxShadow:
                                "0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8)",
                            }}
                          >
                            <motion.span
                              animate={{ opacity: [1, 0.8, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              Auj.
                            </motion.span>
                          </motion.div>
                        )}

                        {/* Icône rouge avec tooltip pour la prochaine permanence */}
                        {isNextPermanence && !isToday && (
                          <NextPermanenceIcon
                            corner={resolveNextPermanenceBadgeCorner(index)}
                          />
                        )}

                        {/* Glow animé pour aujourd'hui */}
                        {isToday && (
                          <>
                            <motion.div
                              className={`absolute -inset-2 bg-gradient-to-br ${colorScheme.primary} rounded-2xl blur-xl opacity-40`}
                              animate={{
                                opacity: [0.3, 0.5, 0.3],
                                scale: [1, 1.15, 1],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            <motion.div
                              className={`absolute -inset-1 bg-gradient-to-br ${colorScheme.primary} rounded-2xl blur-md opacity-60`}
                              animate={{
                                opacity: [0.4, 0.7, 0.4],
                                scale: [1, 1.08, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.3,
                              }}
                            />
                          </>
                        )}

                        {/* Jour de la semaine avec style moderne */}
                        <div className="relative z-10">
                          <div
                            className={`text-[11px] font-bold mb-2 uppercase tracking-widest ${
                              isToday || isNextPermanence
                                ? "text-white/95"
                                : "text-gray-500"
                            }`}
                          >
                            {weekday.slice(0, 3)}
                          </div>

                          {/* Numéro du jour avec effet moderne */}
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            className={`text-2xl md:text-3xl font-black mb-2 leading-none ${
                              isToday || isNextPermanence
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                            style={{
                              textShadow:
                                isToday || isNextPermanence
                                  ? "0 2px 12px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)"
                                  : "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          >
                            {day}
                          </motion.div>
                        </div>

                        {/* Horaires avec icône animée */}
                        <div
                          className={`flex items-center gap-1.5 text-[11px] font-semibold relative z-10 ${
                            isToday || isNextPermanence ? "text-white/95" : ""
                          }`}
                        >
                          <motion.div
                            animate={
                              isToday || isNextPermanence
                                ? { rotate: [0, 360] }
                                : {}
                            }
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="flex-shrink-0"
                          >
                            <Clock
                              className={`w-3 h-3 ${
                                isToday || isNextPermanence
                                  ? "text-white"
                                  : "text-emerald-500"
                              }`}
                              strokeWidth={2.5}
                            />
                          </motion.div>
                          <span
                            className={`tracking-tight ${
                              isToday || isNextPermanence
                                ? "text-white/95"
                                : `bg-gradient-to-r ${colorScheme.primary} bg-clip-text text-transparent font-bold`
                            }`}
                          >
                            {timeByDate.get(dateStr) ?? ""}
                          </span>
                        </div>

                        {/* Effet hover avec gradient pour les dates futures */}
                        {!isPast && !isToday && !isNextPermanence && (
                          <>
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${colorScheme.primary} opacity-0 group-hover/date:opacity-8 rounded-2xl transition-opacity duration-500`}
                            />
                            <motion.div
                              className={`absolute -inset-0.5 bg-gradient-to-br ${colorScheme.primary} opacity-0 group-hover/date:opacity-20 blur-sm rounded-2xl transition-opacity duration-500`}
                            />
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
    </TooltipProvider>
  );
}
