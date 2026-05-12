/**
 * Clés de cache TanStack Query pour la liste bureau des adhérents.
 */
export const adherentDashboardKeys = {
  all: ["bureau", "adherents", "dashboard"] as const,
  detail: (personId: string) =>
    ["bureau", "adherents", "detail", personId] as const,
};
