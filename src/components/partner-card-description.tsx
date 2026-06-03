"use client";

import { parseInlineEmphasis } from "@/lib/format/inline-emphasis";
import { cn } from "@/helpers/utils";
import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface PartnerCardDescriptionProps {
  description: string;
  partnerId: number;
  onExpandedChange?: (isExpanded: boolean) => void;
}

/** Hauteur minimale de la zone scrollable une fois déployée */
const EXPANDED_SCROLL_MIN_H =
  "min-h-[8.75rem] sm:min-h-[10.25rem] md:min-h-[11rem]";

const TEXT_CLASSES =
  "text-sm leading-relaxed text-gray-600 sm:text-base";

/**
 * Description tronquée à 2 lignes ; déploiement dans la carte au survol (desktop) ou au tap.
 */
export function PartnerCardDescription({
  description,
  partnerId,
  onExpandedChange,
}: PartnerCardDescriptionProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [prefersHoverExpand, setPrefersHoverExpand] = useState(false);

  const formattedDescription = useMemo(
    () => parseInlineEmphasis(description),
    [description],
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPrefersHoverExpand(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el || isExpanded) return;
    setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    setHasMeasured(true);
  }, [isExpanded]);

  useLayoutEffect(() => {
    if (isExpanded) return;
    measure();
    const el = textRef.current;
    if (!el) return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [description, isExpanded, measure]);

  const handleExpand = useCallback(() => {
    if (!isTruncated) return;
    setIsExpanded(true);
  }, [isTruncated]);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!prefersHoverExpand || !isTruncated) return;
    handleExpand();
  }, [prefersHoverExpand, isTruncated, handleExpand]);

  const handleMouseLeave = useCallback(() => {
    if (!prefersHoverExpand) return;
    handleCollapse();
  }, [prefersHoverExpand, handleCollapse]);

  const handleToggleClick = useCallback(() => {
    if (!isTruncated) return;
    setIsExpanded((prev) => !prev);
  }, [isTruncated]);

  const showToggle = hasMeasured && isTruncated;

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "min-h-0 flex-1 transition-[min-height,padding] duration-300 ease-out",
          isExpanded && [
            EXPANDED_SCROLL_MIN_H,
            "overflow-y-auto overscroll-contain",
            "rounded-lg border border-blue-100/70 bg-white/90",
            "px-2.5 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]",
            "sm:px-3 sm:py-2.5",
          ],
          !isExpanded && "overflow-hidden",
        )}
      >
        <p
          ref={textRef}
          id={`partner-${partnerId}-desc`}
          className={cn(
            TEXT_CLASSES,
            !isExpanded &&
              (!hasMeasured || isTruncated) &&
              "line-clamp-2",
            isExpanded && "text-gray-700",
          )}
        >
          {formattedDescription}
        </p>
      </div>

      {showToggle ? (
        <button
          type="button"
          className={cn(
            "mt-1.5 inline-flex shrink-0 items-center gap-1 self-start rounded-md",
            "text-xs font-semibold text-blue-600 transition-colors duration-200",
            "hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-blue-500/30 focus-visible:ring-offset-1",
            isExpanded && "text-indigo-600",
          )}
          aria-expanded={isExpanded}
          aria-controls={`partner-${partnerId}-desc`}
          onClick={handleToggleClick}
        >
          {isExpanded ? "Réduire" : "Lire la suite"}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
