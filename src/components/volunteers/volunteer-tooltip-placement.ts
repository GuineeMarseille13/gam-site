export type VolunteerTooltipPlacement = "bottom" | "top" | "right" | "left";

export const VOLUNTEER_TOOLTIP_WIDTH_PX = 224;
export const VOLUNTEER_TOOLTIP_GAP_PX = 12;
export const VOLUNTEER_TOOLTIP_HEIGHT_ESTIMATE_PX = 80;

const PLACEMENT_PRIORITY: VolunteerTooltipPlacement[] = [
  "bottom",
  "top",
  "right",
  "left",
];

interface PlacementSpace {
  placement: VolunteerTooltipPlacement;
  space: number;
}

function getViewportBoundaryRect(containerRect: DOMRect): DOMRect {
  const padding = { top: 16, right: 16, bottom: 96, left: 16 };

  const top = Math.max(containerRect.top, padding.top);
  const left = Math.max(containerRect.left, padding.left);
  const right = Math.min(containerRect.right, window.innerWidth - padding.right);
  const bottom = Math.min(containerRect.bottom, window.innerHeight - padding.bottom);

  return new DOMRect(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
}

function getAvailableSpace(
  avatarRect: DOMRect,
  boundaryRect: DOMRect,
): Record<VolunteerTooltipPlacement, number> {
  const gap = VOLUNTEER_TOOLTIP_GAP_PX;

  return {
    bottom: boundaryRect.bottom - avatarRect.bottom - gap,
    top: avatarRect.top - boundaryRect.top - gap,
    right: boundaryRect.right - avatarRect.right - gap,
    left: avatarRect.left - boundaryRect.left - gap,
  };
}

function fitsPlacement(
  placement: VolunteerTooltipPlacement,
  space: Record<VolunteerTooltipPlacement, number>,
  tooltipWidth: number,
  tooltipHeight: number,
): boolean {
  if (placement === "bottom" || placement === "top") {
    const verticalSpace = space[placement];
    return verticalSpace >= tooltipHeight;
  }

  return space[placement] >= tooltipWidth;
}

function pickBestFallback(spaces: Record<VolunteerTooltipPlacement, number>): VolunteerTooltipPlacement {
  const ranked: PlacementSpace[] = PLACEMENT_PRIORITY.map((placement) => ({
    placement,
    space: spaces[placement],
  }));

  ranked.sort((a, b) => b.space - a.space);
  return ranked[0]?.placement ?? "bottom";
}

/**
 * Choisit la position du tooltip : bas → haut → droite → gauche.
 */
export function resolveVolunteerTooltipPlacement(
  avatarRect: DOMRect,
  boundaryContainer: HTMLElement | null,
  tooltipWidth = VOLUNTEER_TOOLTIP_WIDTH_PX,
  tooltipHeight = VOLUNTEER_TOOLTIP_HEIGHT_ESTIMATE_PX,
): VolunteerTooltipPlacement {
  const containerRect = boundaryContainer?.getBoundingClientRect();
  const boundaryRect = containerRect
    ? getViewportBoundaryRect(containerRect)
    : new DOMRect(16, 16, window.innerWidth - 32, window.innerHeight - 112);

  const spaces = getAvailableSpace(avatarRect, boundaryRect);

  for (const placement of PLACEMENT_PRIORITY) {
    if (fitsPlacement(placement, spaces, tooltipWidth, tooltipHeight)) {
      return placement;
    }
  }

  return pickBestFallback(spaces);
}

export const volunteerTooltipPositionClasses: Record<VolunteerTooltipPlacement, string> = {
  bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
  top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
  right: "left-full top-1/2 -translate-y-1/2 ml-3",
  left: "right-full top-1/2 -translate-y-1/2 mr-3",
};

export const volunteerTooltipArrowClasses: Record<VolunteerTooltipPlacement, string> = {
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-x-6 border-b-6 border-x-transparent border-b-gray-900",
  top: "top-full left-1/2 -translate-x-1/2 border-x-6 border-t-6 border-x-transparent border-t-gray-900",
  right:
    "right-full top-1/2 -translate-y-1/2 border-y-6 border-r-6 border-y-transparent border-r-gray-900",
  left: "left-full top-1/2 -translate-y-1/2 border-y-6 border-l-6 border-y-transparent border-l-gray-900",
};
