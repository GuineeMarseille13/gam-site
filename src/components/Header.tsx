"use client";

import HeaderBrand from "./HeaderBrand";
import HeaderNavigation from "./HeaderNavigation";
import { useEventMediaPreview } from "@/contexts/event-media-preview-context";

export default function Header() {
  const { isLightboxOpen } = useEventMediaPreview() ?? {};

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeaderBrand />
      </div>
      {!isLightboxOpen && (
        <div className="sticky top-2 z-50">
          <HeaderNavigation />
        </div>
      )}
    </>
  );
}
