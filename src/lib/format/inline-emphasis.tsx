import type { ReactNode } from "react";

const EMPHASIS_PATTERN = /\*\*([^*]+)\*\*/g;

/**
 * Transforme les segments `**gras**` en <strong> (sans HTML brut).
 */
export function parseInlineEmphasis(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = EMPHASIS_PATTERN.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <strong
        key={`emphasis-${match.index}`}
        className="font-semibold text-gray-800"
      >
        {match[1]}
      </strong>,
    );

    lastIndex = match.index + match[0].length;
    match = EMPHASIS_PATTERN.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}
