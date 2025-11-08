/**
 * Utilitaires pour la gestion des événements
 */

import { EventsByYear } from "@/types/events";

/**
 * Trie les années par ordre décroissant
 */
export function getSortedYears(eventsData: EventsByYear): number[] {
  return Object.keys(eventsData)
    .map(Number)
    .sort((a, b) => b - a);
}

/**
 * Calcule le nombre total d'événements
 */
export function getTotalEvents(eventsData: EventsByYear): number {
  return Object.values(eventsData).reduce(
    (sum, events) => sum + events.length,
    0
  );
}

/**
 * Obtient l'année actuelle
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Formate le nombre d'événements avec pluriel
 */
export function formatEventCount(count: number): string {
  return `${count} événement${count > 1 ? "s" : ""}`;
}

/**
 * Formate le nombre d'années avec pluriel
 */
export function formatYearCount(count: number): string {
  return `${count} année${count > 1 ? "s" : ""}`;
}

