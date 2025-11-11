"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  aspectRatio?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallback,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
  aspectRatio,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Générer un fallback basé sur le nom pour les avatars
  const defaultFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=400&background=10b981&color=fff`;

  // Vérifier si l'image existe avant de l'afficher
  useEffect(() => {
    if (!src) {
      setHasError(true);
      setImgSrc(fallback || defaultFallback);
      setIsValidating(false);
      return;
    }

    // Réinitialiser l'état
    setIsValidating(true);
    setHasError(false);
    setImgSrc(src);

    // Pour les URLs externes, on fait confiance
    if (src.startsWith("http")) {
      setIsValidating(false);
      return;
    }

    // Pour les images locales, vérifier si elles existent
    const img = new window.Image();
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const checkImage = () => {
      img.onload = () => {
        if (isMounted) {
          setIsValidating(false);
          setHasError(false);
          setImgSrc(src);
        }
      };

      img.onerror = () => {
        if (isMounted) {
          setIsValidating(false);
          setHasError(true);
          setImgSrc(fallback || defaultFallback);
        }
      };

      // Timeout après 1.5 secondes pour les images locales
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setIsValidating(false);
          setHasError(true);
          setImgSrc(fallback || defaultFallback);
        }
      }, 1500);

      img.src = src;
    };

    checkImage();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback, defaultFallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback || defaultFallback);
    }
  };

  // Utiliser le fallback si erreur détectée
  const finalSrc = hasError ? (fallback || defaultFallback) : imgSrc;
  const shouldUnoptimize = hasError || finalSrc.startsWith("https://ui-avatars.com");

  // Afficher un placeholder pendant la validation
  if (isValidating && !hasError) {
    if (fill) {
      return (
        <div className={cn("absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse", className)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-400 rounded-full animate-spin" />
          </div>
        </div>
      );
    }
    return (
      <div className={cn("relative bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse", className, aspectRatio && `aspect-${aspectRatio}`)} style={{ width, height }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={cn(className)}
        sizes={sizes}
        priority={priority}
        unoptimized={shouldUnoptimize}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn(className, aspectRatio && `aspect-${aspectRatio}`)}
      sizes={sizes}
      priority={priority}
      unoptimized={shouldUnoptimize}
      onError={handleError}
    />
  );
}
