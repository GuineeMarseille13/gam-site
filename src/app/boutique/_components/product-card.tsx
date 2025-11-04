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
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {/* Gradient border wrapper for a premium look */}
      <motion.div
        className="group rounded-2xl p-[1px] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 hover:from-slate-300 hover:to-slate-200 transition-colors duration-300"
        whileHover={{ y: -2, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
      <Card className="h-full bg-white/80 backdrop-blur shadow-sm shadow-black/5 hover:shadow-2xl hover:shadow-black/15 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden ring-1 ring-slate-100">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Media */}
          <div className="relative h-44 bg-gradient-to-b from-gray-50 to-white">
            {/* Decorative gradient ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-36 w-36 rounded-full bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 opacity-20 group-hover:opacity-30 blur-md transition-opacity" />
            </div>
            {/* Soft drop shadow below image */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 h-6 w-36 rounded-full bg-black/10 blur-md opacity-20 group-hover:opacity-30 transition-opacity" />
            <Image src={product.image} alt={product.name} fill className="object-contain group-hover:scale-105 transition-transform duration-500" />
            {product.featured && (
              <span className="absolute top-3 left-3 px-2 py-1 text-xs rounded-full bg-theme-red text-white shadow-md">Coup de cœur</span>
            )}
            {product.discount && (
              <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-theme-green text-white shadow-md">-{product.discount}%</span>
            )}
            {product.category && (
              <span className="absolute bottom-3 right-3 text-xs rounded-full bg-white/85 backdrop-blur px-2 py-0.5 border border-gray-200 text-gray-700 shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-transform">
                {product.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 tracking-tight">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
            )}

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-theme-red">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onAdd(product)}
                disabled={!product.inStock}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-xl shadow-black/13 ${
                  product.inStock
                    ? "bg-gradient-to-r from-theme-red to-theme-yellow text-white hover:opacity-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {product.inStock && <ShoppingBag className="w-4 h-4" />}
                <span>{product.inStock ? "Ajouter" : "Épuisé"}</span>
              </motion.button>
              {/* Ripple spark on add hover (visual cue) */}
            </div>
          </div>

          {/* Bottom accent bar (neutral, light, modern) */}
          <div className="h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 opacity-80 group-hover:opacity-100" />
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
}


