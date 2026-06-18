/**
 * Génère une image de repli (initiales) pour une réalisation pôle.
 */
export function getPoleAchievementImageFallback(title: string, size = 800): string {
  const label = title.trim() || "Réalisation";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&size=${size}&background=10b981&color=fff&bold=true`;
}
