"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/helpers/utils";

const LINE_CLAMP_CLASSES = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
  7: "line-clamp-7",
  8: "line-clamp-8",
} as const;

export type ExpandableTextLines = keyof typeof LINE_CLAMP_CLASSES;

export const EVENT_DESCRIPTION_PREVIEW_LINES = 8 satisfies ExpandableTextLines;

type ExpandableTextTone = "default" | "events";

const TONE_TOGGLE_CLASSES: Record<ExpandableTextTone, string> = {
  default:
    "text-theme-green hover:text-theme-green-dark focus-visible:ring-theme-green/35 dark:text-theme-green-light dark:hover:text-theme-green",
  events:
    "text-amber-600 hover:text-amber-700 focus-visible:ring-amber-500/35",
};

const TONE_FADE_CLASSES: Record<ExpandableTextTone, string> = {
  default: "from-white/95 via-white/70 to-transparent dark:from-card/95 dark:via-card/70",
  events: "from-white via-white/80 to-transparent",
};

interface ExpandableTextProps {
  text: string;
  lines?: ExpandableTextLines;
  tone?: ExpandableTextTone;
  className?: string;
  contentClassName?: string;
  id?: string;
}

/**
 * Texte repliable : aperçu sur N lignes + « Lire la suite » / « Réduire » si débordement.
 */
export function ExpandableText({
  text,
  lines = EVENT_DESCRIPTION_PREVIEW_LINES,
  tone = "default",
  className,
  contentClassName,
  id,
}: ExpandableTextProps) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const generatedId = useId();
  const contentId = id ?? generatedId;

  const [isExpanded, setIsExpanded] = useState(false);
  const [canCollapse, setCanCollapse] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
    setHasMeasured(false);
    setCanCollapse(false);
  }, [text]);

  const measure = useCallback(() => {
    if (isExpanded) return;

    const el = contentRef.current;
    if (!el) return;

    const isOverflowing = el.scrollHeight > el.clientHeight + 1;
    setCanCollapse(isOverflowing);
    setHasMeasured(true);
  }, [isExpanded]);

  useLayoutEffect(() => {
    measure();

    const el = contentRef.current;
    if (!el || isExpanded) return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, isExpanded, measure, lines]);

  const handleToggle = useCallback(() => {
    if (!canCollapse) return;
    setIsExpanded((prev) => !prev);
  }, [canCollapse]);

  const trimmed = text.trim();
  if (!trimmed) return null;

  const showToggle = hasMeasured && canCollapse;
  const lineClampClass = LINE_CLAMP_CLASSES[lines];

  return (
    <div className={cn("min-w-0", className)}>
      <div className="relative">
        <p
          ref={contentRef}
          id={contentId}
          className={cn(
            contentClassName,
            !isExpanded && lineClampClass,
          )}
        >
          {trimmed}
        </p>

        {showToggle && !isExpanded ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t",
              TONE_FADE_CLASSES[tone],
            )}
          />
        ) : null}
      </div>

      {showToggle ? (
        <button
          type="button"
          className={cn(
            "mt-2 inline-flex min-h-[44px] items-center gap-1 self-start rounded-md sm:min-h-0",
            "text-sm font-semibold transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            TONE_TOGGLE_CLASSES[tone],
          )}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={handleToggle}
        >
          {isExpanded ? "Réduire" : "Lire la suite"}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}
