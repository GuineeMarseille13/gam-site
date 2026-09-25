import type { ImageLoaderProps } from "next/image";

import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery";

/**
 * Loader next/image : délègue le redimensionnement à Cloudinary (c_limit = jamais de recadrage).
 */
export function popupImageLoader({ src, width, quality }: ImageLoaderProps): string {
  return cloudinaryImageUrl(src, `w_${width},c_limit,q_${quality ?? "auto"},f_auto`);
}
