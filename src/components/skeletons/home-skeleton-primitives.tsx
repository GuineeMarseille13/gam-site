import { cn } from "@/helpers/utils";

/** Style commun : pulse sobre (pas de shimmer). */
export const HOME_SK_PULSE =
  "rounded-md bg-muted animate-pulse dark:bg-muted/70";

interface PulseBarProps {
  className?: string;
}

/**
 * Barre générique pour texte ou blocs — animation `pulse` standard.
 */
export function PulseBar({ className }: PulseBarProps) {
  return <div className={cn(HOME_SK_PULSE, className)} aria-hidden />;
}
