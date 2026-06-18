import type { ReactNode } from "react";

const EMPHASIS_PATTERN = /\*\*([^*]+)\*\*/g;

interface ParseInlineEmphasisOptions {
  strongClassName?: string;
}

/**
 * Transforme les segments `**gras**` en <strong> (sans HTML brut).
 */
export function parseInlineEmphasis(
  text: string,
  options?: ParseInlineEmphasisOptions,
): ReactNode[] {
  const strongClassName = options?.strongClassName ?? "font-semibold text-gray-800";
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(EMPHASIS_PATTERN)) {
    if (match.index === undefined) continue;

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <strong
        key={`emphasis-${match.index}`}
        className={strongClassName}
      >
        {match[1]}
      </strong>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}
