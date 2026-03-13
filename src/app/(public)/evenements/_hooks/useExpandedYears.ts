/**
 * Hook personnalisé pour gérer l'état d'expansion des années
 */

import { useState, useCallback } from "react";

/**
 * Gère l'état d'expansion des sections d'années
 * @param defaultExpandedYears - Années à ouvrir par défaut
 * @returns Objet avec les méthodes pour gérer l'expansion
 */
export function useExpandedYears(defaultExpandedYears: number[] = []) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    new Set(defaultExpandedYears)
  );

  const toggleYear = useCallback((year: number) => {
    setExpandedYears((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  }, []);

  const isExpanded = useCallback(
    (year: number) => expandedYears.has(year),
    [expandedYears]
  );

  const expandYear = useCallback((year: number) => {
    setExpandedYears((prev) => new Set(prev).add(year));
  }, []);

  const collapseYear = useCallback((year: number) => {
    setExpandedYears((prev) => {
      const newSet = new Set(prev);
      newSet.delete(year);
      return newSet;
    });
  }, []);

  const expandAll = useCallback((years: number[]) => {
    setExpandedYears(new Set(years));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedYears(new Set());
  }, []);

  return {
    expandedYears,
    toggleYear,
    isExpanded,
    expandYear,
    collapseYear,
    expandAll,
    collapseAll,
  };
}

