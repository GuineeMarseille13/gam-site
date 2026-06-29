"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand } from "lucide-react";
import {
  CinemaAmbientBackground,
  CinemaHeader,
  CinemaMediaShell,
} from "@/components/lightbox/cinema-lightbox-primitives";
import { formatCurrency } from "@/helpers/format-currency";
import { cn } from "@/helpers/utils";

interface ProductImageLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  price?: number;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}

/**
 * Composant: ProductImageLightbox
 * Rôle: Image produit cliquable avec aperçu plein écran style cinéma (fond ambiant + glassmorphism).
 */
export function ProductImageLightbox({
  src,
  alt,
  caption,
  price,
  sizes = "(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) 320px, 400px",
  className,
  imageClassName,
}: ProductImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleClose]);

  const lightbox = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="product-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={caption ?? alt}
        >
          <CinemaAmbientBackground imageUrl={src} />

          <CinemaHeader
            label="Produit"
            title={caption ?? alt}
            onClose={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 pt-[4.75rem] pb-24 sm:px-10 sm:pt-24 sm:pb-28"
            onClick={(event) => event.stopPropagation()}
          >
            <CinemaMediaShell>
              <div className="relative overflow-hidden rounded-xl bg-black ring-1 ring-white/10 sm:rounded-3xl">
                <Image
                  src={src}
                  alt={alt}
                  width={1600}
                  height={1200}
                  className="mx-auto h-full w-full max-h-[min(58vh,82vw)] object-contain sm:max-h-[min(68vh,56vw)]"
                  sizes="90vw"
                  priority
                />
              </div>
            </CinemaMediaShell>
          </motion.div>

          {(caption || price !== undefined) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.14, duration: 0.35 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5 sm:pb-8"
            >
              <div className="flex max-w-lg flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-center shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                {caption ? (
                  <p className="text-sm font-semibold text-white sm:text-base">{caption}</p>
                ) : null}
                {price !== undefined ? (
                  <p className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-400 bg-clip-text text-lg font-extrabold text-transparent sm:text-xl">
                    {formatCurrency(price)}
                  </p>
                ) : null}
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "group/image relative block h-full w-full cursor-zoom-in overflow-hidden",
          className,
        )}
        aria-label={`Agrandir l'image : ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-500 ease-out group-hover/image:scale-110",
            imageClassName,
          )}
        />
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-100 transition-opacity duration-300 sm:from-black/55 sm:opacity-0 sm:group-hover/image:opacity-100"
          aria-hidden
        />
        {/* Mobile : indicateur toujours visible (pas de hover tactile) */}
        <span
          className="pointer-events-none absolute bottom-2.5 right-2.5 z-[1] flex sm:hidden"
          aria-hidden
        >
          <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-md">
            <Expand className="size-3" strokeWidth={2.5} />
            Agrandir
          </span>
        </span>
        {/* Desktop : pastille au survol */}
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 justify-center pb-3 opacity-0 transition-all duration-300 group-hover/image:translate-y-0 group-hover/image:opacity-100 sm:flex"
          aria-hidden
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur-md sm:text-xs">
            <Expand className="size-3.5" strokeWidth={2.5} />
            Agrandir
          </span>
        </span>
      </button>

      {mounted ? createPortal(lightbox, document.body) : null}
    </>
  );
}
