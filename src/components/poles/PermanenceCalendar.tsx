"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";

// Composant pour l'icône avec tooltip
function NextPermanenceIcon() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="absolute -top-3 -right-3 z-[100]">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        className="relative w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all duration-200 flex items-center justify-center shadow-2xl cursor-pointer group border-2 border-white"
        style={{
          boxShadow:
            "0 6px 20px rgba(239, 68, 68, 0.6), 0 3px 8px rgba(239, 68, 68, 0.5), 0 0 0 2px rgba(255,255,255,0.8)",
        }}
      >
        <Info className="w-5 h-5 text-white" strokeWidth={3} />

        {/* Glow pulsant plus visible */}
        <motion.div
          className="absolute -inset-1 bg-red-500 rounded-full"
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ zIndex: -1 }}
        />

        {/* Tooltip amélioré */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-full right-0 mb-3 px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-2xl whitespace-nowrap z-[200] border border-gray-700"
              style={{
                boxShadow:
                  "0 12px 32px rgba(0,0,0,0.5), 0 6px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="relative z-10">Prochaine permanence</span>
              {/* Flèche pointant vers l'icône */}
              <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

interface PermanenceCalendarProps {
  dates: string[]; // Format: "YYYY-MM-DD"
  schedule: string; // Ex: "14h à 18h"
  colorScheme: {
    primary: string;
  };
}

export default function PermanenceCalendar({
  dates,
  schedule,
  colorScheme,
}: PermanenceCalendarProps) {
  // Extraire les heures de la chaîne schedule (ex: "Permanences les samedis de 14h à 16h" -> "14h-16h")
  const extractHours = (scheduleText: string): string => {
    const hourMatch = scheduleText.match(
      /(\d{1,2})h\s*(?:à|au|-)\s*(\d{1,2})h/
    );
    if (hourMatch) {
      return `${hourMatch[1]}h-${hourMatch[2]}h`;
    }
    // Fallback si le format n'est pas reconnu
    return scheduleText.includes("14h") && scheduleText.includes("16h")
      ? "14h-16h"
      : scheduleText;
  };

  const displaySchedule = extractHours(schedule);

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
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 md:mb-12"
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
            Calendrier des Permanences 2025
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
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
              className="group relative bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-5 md:p-6 border border-gray-200/40 overflow-hidden"
              style={{
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
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
                className={`absolute inset-0 bg-gradient-to-br ${colorScheme.primary} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 pointer-events-none`}
              />
              {/* Bordure lumineuse au hover */}
              <motion.div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colorScheme.primary} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 pointer-events-none`}
              />
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
                <div className="grid grid-cols-3 gap-2.5 relative">
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
                        className={`group/date relative p-3 md:p-3.5 rounded-2xl border transition-all duration-300 ${
                          isNextPermanence
                            ? "overflow-visible"
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
                        {isNextPermanence && !isToday && <NextPermanenceIcon />}

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
                            {displaySchedule}
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
  );
}
