import type { ReactNode } from "react";

import { parseInlineEmphasis } from "@/lib/format/inline-emphasis";
import { splitAssociationParagraphs } from "@/lib/format/split-association-paragraphs";
import {
  isAssociationHtmlContent,
  sanitizeAssociationHtml,
} from "@/lib/format/association-content-format";
import { cn } from "@/helpers/utils";

type AssociationFormattedTextVariant = "body" | "quote";

const VARIANT_STYLES = {
  body: {
    paragraph:
      "text-left text-base leading-relaxed text-gray-700 sm:text-justify sm:text-lg",
    strong: "font-semibold text-gray-800",
    rich: cn(
      "space-y-5 sm:space-y-6",
      "[&_p]:text-left [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-gray-700 sm:[&_p]:text-justify sm:[&_p]:text-lg",
      "[&_strong]:font-semibold [&_strong]:text-gray-800",
      "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
      "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
    ),
  },
  quote: {
    paragraph:
      "text-pretty break-words text-left font-serif text-base italic leading-relaxed text-gray-700 sm:text-justify sm:text-lg md:text-xl",
    strong: "font-bold not-italic text-gray-900",
    rich: cn(
      "space-y-5 sm:space-y-7 md:space-y-8",
      "[&_p]:text-pretty [&_p]:break-words [&_p]:text-left [&_p]:font-serif [&_p]:text-base [&_p]:italic [&_p]:leading-relaxed [&_p]:text-gray-700 sm:[&_p]:text-justify sm:[&_p]:text-lg md:[&_p]:text-xl",
      "[&_strong]:font-bold [&_strong]:not-italic [&_strong]:text-gray-900",
      "[&_em]:italic",
      "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:not-italic",
      "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:not-italic",
    ),
  },
} as const satisfies Record<
  AssociationFormattedTextVariant,
  { paragraph: string; strong: string; rich: string }
>;

interface AssociationFormattedTextProps {
  text: string;
  variant?: AssociationFormattedTextVariant;
  className?: string;
  paragraphClassName?: string;
}

/**
 * Affiche un contenu association : HTML riche ou texte legacy (paragraphes + **gras**).
 */
export function AssociationFormattedText({
  text,
  variant = "body",
  className,
  paragraphClassName,
}: AssociationFormattedTextProps) {
  const styles = VARIANT_STYLES[variant];
  const trimmed = text.trim();

  if (!trimmed) return null;

  if (isAssociationHtmlContent(trimmed)) {
    const sanitized = sanitizeAssociationHtml(trimmed);
    if (!sanitized) return null;

    return (
      <div
        className={cn(styles.rich, className)}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  const paragraphs = splitAssociationParagraphs(trimmed);
  if (paragraphs.length === 0) return null;

  return (
    <div className={cn("space-y-5 sm:space-y-6 md:space-y-8", className)}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 24)}`}
          className={cn(styles.paragraph, paragraphClassName)}
        >
          {parseInlineEmphasis(paragraph, { strongClassName: styles.strong })}
        </p>
      ))}
    </div>
  );
}

/**
 * Contenu d'un seul paragraphe (intro, conclusion, etc.).
 */
export function AssociationFormattedInline({
  text,
  variant = "body",
  className,
}: {
  text: string;
  variant?: AssociationFormattedTextVariant;
  className?: string;
}): ReactNode {
  const styles = VARIANT_STYLES[variant];
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (isAssociationHtmlContent(trimmed)) {
    const sanitized = sanitizeAssociationHtml(trimmed);
    if (!sanitized) return null;

    return (
      <span
        className={cn(styles.rich, "inline [&_p]:inline", className)}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return (
    <span className={className}>
      {parseInlineEmphasis(trimmed, { strongClassName: styles.strong })}
    </span>
  );
}

export { splitAssociationParagraphs };
