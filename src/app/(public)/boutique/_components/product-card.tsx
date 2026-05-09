"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/format-currency";
import type { Product } from "../_schemas/product.schema";
import { usePathname } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  /** Mise en évidence (ex: après redirection depuis "Commander") */
  isHighlighted?: boolean;
}

export function ProductCard({ product, onAdd, isHighlighted = false }: ProductCardProps) {
  const pathname = usePathname();
  const isBoutique = pathname === "/boutique";

  return (
    <motion.div
      id={`product-${product.id}`}
      data-highlighted={isHighlighted}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`h-full scroll-mt-24 sm:scroll-mt-28 ${isHighlighted ? "scroll-smooth" : ""}`}
    >
      <motion.div
        className={`group h-full rounded-xl sm:rounded-2xl p-[2px] bg-gradient-to-br from-amber-200 via-yellow-200 to-lime-200 hover:from-amber-300 hover:via-yellow-300 hover:to-lime-300 shadow-lg shadow-amber-100/50 transition-all duration-300 ${
          isHighlighted
            ? "ring-2 ring-emerald-500 ring-offset-2 sm:ring-offset-4 shadow-emerald-200/60 shadow-xl"
            : ""
        }`}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        animate={isHighlighted ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="h-full py-0 bg-white shadow-none rounded-xl sm:rounded-2xl overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">

            {/* Image - mêmes proportions que la base (340×220) sur tous les breakpoints */}
            <div className="relative w-full aspect-[34/22] sm:aspect-auto sm:h-[200px] lg:h-[220px] overflow-hidden shrink-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 340px, (max-width: 1024px) 320px, 340px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
                  <span className="text-5xl font-bold text-amber-200">{product.name[0]}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {product.featured && (
                <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow">
                  Coup de cœur
                </span>
              )}
              {product.discount && (
                <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow">
                  -{product.discount}%
                </span>
              )}
              {isHighlighted && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-center"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold tracking-wide shadow-[0_2px_12px_-2px_rgba(16,185,129,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] backdrop-blur-md">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} stroke="currentColor" />
                    </span>
                    <span>Ajouté au panier</span>
                  </span>
                </motion.div>
              )}
            </div>

            {/* Content - espacement identique à la base sur tous les breakpoints */}
            <div className="flex-1 p-5 flex flex-col min-w-0">
              <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-2 tracking-tight">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed min-h-[2.5rem]">
                {product.description ?? ""}
              </p>

              {/* Prix et bouton - côte à côte comme en base */}
              <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Prix */}
                <div className="flex flex-col">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through leading-none mb-0.5">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  <span className={`text-lg sm:text-xl font-extrabold leading-tight ${product.discount ? "text-emerald-600" : "bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"}`}>
                    {formatCurrency(product.price)}
                  </span>
                </div>

                {/* Bouton - pleine largeur sur mobile */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAdd(product)}
                  disabled={!product.inStock}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer shadow-lg shrink-0 min-h-[44px] ${
                    product.inStock
                      ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 text-white hover:shadow-orange-200/50 hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {product.inStock && <ShoppingBag className="w-4 h-4 shrink-0" />}
                  <span>{product.inStock ? (isBoutique ? "Ajouter" : "Commander") : "Épuisé"}</span>
                </motion.button>
              </div>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
