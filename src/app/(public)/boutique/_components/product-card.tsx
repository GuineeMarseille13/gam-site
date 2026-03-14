"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "../_schemas/product.schema";
import { usePathname } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price / 100);

  const pathname = usePathname();
  const isBoutique = pathname === "/boutique";

  return (
    <motion.div
      id={`product-${product.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <motion.div
        className="group h-full rounded-2xl p-[2px] bg-gradient-to-br from-amber-200 via-yellow-200 to-lime-200 hover:from-amber-300 hover:via-yellow-300 hover:to-lime-300 shadow-lg shadow-amber-100/50 transition-all duration-300"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <Card className="h-full py-0 bg-white shadow-none rounded-2xl overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">

            {/* Image */}
            <div className="relative w-full h-[220px] overflow-hidden shrink-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 340px"
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
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col">
              <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-2 tracking-tight">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed h-10">
                {product.description ?? ""}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3">
                {/* Prix */}
                <div className="flex flex-col">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through leading-none mb-0.5">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className={`text-xl font-extrabold leading-tight ${product.discount ? "text-emerald-600" : "bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"}`}>
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Bouton */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAdd(product)}
                  disabled={!product.inStock}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer shadow-lg ${
                    product.inStock
                      ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 text-white hover:shadow-orange-200/50 hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {product.inStock && <ShoppingBag className="w-4 h-4" />}
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
