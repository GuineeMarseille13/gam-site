"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/helpers/utils";

interface ProspectusFooterProps {
  total: number;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  onClose: () => void;
}

const NAV_BUTTON_CLASS =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition-all hover:scale-105 hover:bg-amber-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500";

/**
 * Composant: ProspectusFooter
 * Rôle: Navigation (précédent / points / suivant) et fermeture du carrousel de prospectus.
 */
export function ProspectusFooter({ total, index, onPrev, onNext, onSelect, onClose }: ProspectusFooterProps) {
  const dots = Array.from({ length: total }, (_, i) => i);
  const hasNavigation = total > 1;

  return (
    <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-3">
      {hasNavigation ? (
        <nav className="flex items-center gap-3" aria-label="Navigation des prospectus">
          <button type="button" onClick={onPrev} className={NAV_BUTTON_CLASS} aria-label="Prospectus précédent">
            <ChevronLeft className="size-4" strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-1.5">
            {dots.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Afficher le prospectus ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "cursor-pointer rounded-full transition-all duration-300",
                  i === index ? "h-2 w-6 bg-amber-500" : "size-2 bg-gray-300 hover:bg-amber-300",
                )}
              />
            ))}
          </div>

          <button type="button" onClick={onNext} className={NAV_BUTTON_CLASS} aria-label="Prospectus suivant">
            <ChevronRight className="size-4" strokeWidth={2.5} />
          </button>
        </nav>
      ) : (
        <span />
      )}

      <button
        type="button"
        onClick={onClose}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
      >
        <X className="size-3.5" strokeWidth={2.5} aria-hidden />
        Fermer
      </button>
    </footer>
  );
}
