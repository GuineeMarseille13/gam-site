"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "../_schemas/product.schema";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      {/* Gradient border wrapper for a premium look */}
      <motion.div
        className="group rounded-2xl p-[2px] bg-gradient-to-br from-amber-200 via-yellow-200 to-lime-200 hover:from-amber-300 hover:via-yellow-300 hover:to-lime-300 transition-all duration-300 shadow-lg shadow-amber-100/50"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
      <Card className="h-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 rounded-2xl overflow-hidden ring-1 ring-slate-100/50">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Media */}
          <div className="relative h-48 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Decorative gradient ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-40 w-40 rounded-full bg-gradient-to-r from-amber-200 via-yellow-200 to-lime-200 opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
            </div>
            {/* Soft drop shadow below image */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 h-8 w-40 rounded-full bg-black/10 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <Image src={product.image} alt={product.name} fill className="object-contain group-hover:scale-110 transition-transform duration-500" />
            {product.featured && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-200/50">Coup de cœur</span>
            )}
            {product.discount && (
              <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200/50">-{product.discount}%</span>
            )}
            {product.category && (
              <span className="absolute bottom-3 right-3 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 border-2 border-gray-200/80 text-gray-700 shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                {product.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-2 tracking-tight">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
            )}

            <div className="mt-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAdd(product)}
                disabled={!product.inStock}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer shadow-xl shadow-black/25 ${
                  product.inStock
                    ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 text-white hover:shadow-2xl hover:shadow-orange-200/50"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {product.inStock && <ShoppingBag className="w-4 h-4" />}
                <span>{product.inStock ? "Ajouter" : "Épuisé"}</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-1 bg-gradient-to-r from-amber-200 via-yellow-200 to-lime-200 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
}


