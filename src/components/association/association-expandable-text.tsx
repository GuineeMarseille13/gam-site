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
import {
  AssociationFormattedInline,
  AssociationFormattedText,
} from "@/components/association/association-formatted-text";

/** Hauteur max. repliée : ~5 lignes mobile, ~7 lignes desktop. */
const COLLAPSED_CLASSES =
  "max-h-[15rem] overflow-hidden md:max-h-[20rem]";

type AssociationExpandableTextVariant = "body" | "quote";
type AssociationExpandableTextMode = "block" | "inline";

interface AssociationExpandableTextProps {
  text: string;
  variant?: AssociationExpandableTextVariant;
  mode?: AssociationExpandableTextMode;
  className?: string;
  contentClassName?: string;
  id?: string;
}

/**
 * Texte association repliable : troncature CSS + « Lire la suite » / « Réduire ».
 * Actif sur mobile et desktop lorsque le contenu dépasse la hauteur d'aperçu.
 */
export function AssociationExpandableText({
  text,
  variant = "body",
  mode = "block",
  className,
  contentClassName,
  id,
}: AssociationExpandableTextProps) {
  const contentRef = useRef<HTMLDivElement>(null);
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
  }, [text, isExpanded, measure]);

  const handleToggle = useCallback(() => {
    if (!canCollapse) return;
    setIsExpanded((prev) => !prev);
  }, [canCollapse]);

  const trimmed = text.trim();
  if (!trimmed) return null;

  const showToggle = hasMeasured && canCollapse;

  const formattedContent =
    mode === "block" ? (
      <AssociationFormattedText
        text={trimmed}
        variant={variant}
        className={contentClassName}
      />
    ) : (
      <span className={cn("text-inherit leading-inherit", contentClassName)}>
        <AssociationFormattedInline text={trimmed} variant={variant} />
      </span>
    );

  return (
    <div className={cn("min-w-0", className)}>
      <div className="relative">
        <div
          ref={contentRef}
          id={contentId}
          className={cn(!isExpanded && COLLAPSED_CLASSES)}
        >
          {formattedContent}
        </div>

        {showToggle && !isExpanded ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/95 via-white/70 to-transparent dark:from-card/95 dark:via-card/70"
          />
        ) : null}
      </div>

      {showToggle ? (
        <button
          type="button"
          className={cn(
            "mt-2 inline-flex min-h-[44px] items-center gap-1 self-start rounded-md sm:min-h-0",
            "text-sm font-semibold text-theme-green transition-colors duration-200",
            "hover:text-theme-green-dark focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-theme-green/35 focus-visible:ring-offset-1",
            "dark:text-theme-green-light dark:hover:text-theme-green",
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
