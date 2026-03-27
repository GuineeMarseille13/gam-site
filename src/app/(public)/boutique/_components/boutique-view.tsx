"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { CART_OPEN_EVENT, CART_TOGGLE_EVENT } from "../_services/cart-storage";
import { useCart } from "../_hooks/use-cart";
import { ProductCard } from "./product-card";
import { CartDrawer } from "./cart-drawer";
import type { Product } from "../_schemas/product.schema";
import type { FeaturedProductRecord } from "@/app/_services/home";

/** Durée de la mise en évidence du produit après redirection (ms) */
const HIGHLIGHT_DURATION_MS = 4500;
/** Délai avant le scroll pour laisser le DOM se rendre (ms) */
const SCROLL_DELAY_MS = 150;

const CLOUDINARY_BASE = "https://res.cloudinary.com/df3ymbrqe/image/upload";

function transformProduct(p: FeaturedProductRecord): Product {
  const pct = p.discountPercent ?? 0;
  const hasDiscount = Boolean(p.discountActive && pct > 0);
  const effectivePrice = hasDiscount
    ? Math.round(p.price * (1 - pct / 100))
    : p.price;
  return {
    id: p.id,
    name: p.title ?? "",
    image: p.imageId ? `${CLOUDINARY_BASE}/w_600,h_600,c_fill,q_auto,f_auto/${p.imageId}` : "",
    price: effectivePrice,
    originalPrice: hasDiscount ? p.price : undefined,
    discount: hasDiscount ? pct : undefined,
    description: p.description ?? undefined,
    inStock: (p.stock ?? 0) > 0,
  };
}

export function BoutiqueView() {
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?active=true", { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        const raw = Array.isArray(result.data) ? result.data : [];
        setCatalog(raw.map(transformProduct));
      })
      .catch(() => {});
  }, []);
  const { items, totalPrice, totalQuantity, add, update, remove, clear } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const DRAWER_STATE_KEY = "boutique.drawer.open.v1";
  const searchParams = useSearchParams();
  const router = useRouter();
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const urlHandledRef = useRef(false);

  // 1) Traitement des paramètres URL (openCart, product) - une seule fois au mount
  useEffect(() => {
    if (typeof window === "undefined" || urlHandledRef.current) return;

    const openCartParam = searchParams.get("openCart");
    const productId = searchParams.get("product");

    if (productId) {
      setHighlightedProductId(productId);
    }

    if (openCartParam === "true") {
      setDrawerOpen(true);
      urlHandledRef.current = true;
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("openCart");
      newSearchParams.delete("product");
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  // 2) Scroll vers le produit et retrait de la mise en évidence - quand le catalogue est chargé
  useEffect(() => {
    if (!highlightedProductId || catalog.length === 0) return;

    const productIdStr = String(highlightedProductId);
    const hasProduct = catalog.some((p) => String(p.id) === productIdStr);
    if (!hasProduct) return;

    const scrollTimer = window.setTimeout(() => {
      const element = document.getElementById(`product-${productIdStr}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, SCROLL_DELAY_MS);

    const clearTimer = window.setTimeout(() => {
      setHighlightedProductId(null);
    }, HIGHLIGHT_DURATION_MS);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [highlightedProductId, catalog]);

  // Open drawer if URL hash is #panier (e.g., from mobile header button)
  useEffect(() => {
    // 1) Restore previous state from localStorage. If none, fall back to hash.
    if (typeof window !== "undefined") {
      try {
        const persisted = localStorage.getItem(DRAWER_STATE_KEY);
        if (persisted === "1") {
          setDrawerOpen(true);
        } else if (persisted === "0") {
          setDrawerOpen(false);
        } else if (window.location.hash === "#panier") {
          setDrawerOpen(true);
        }
      } catch {}
    }

    const applyHash = () => {
      if (typeof window === "undefined") return;
      // Hash only influences state if there is no persisted preference
      const persisted = localStorage.getItem(DRAWER_STATE_KEY);
      if (persisted === null) {
        setDrawerOpen(window.location.hash === "#panier");
      }
    };
    window.addEventListener("hashchange", applyHash);

    const openListener = () => setDrawerOpen(true);
    const toggleListener = () => setDrawerOpen((prev) => !prev);
    window.addEventListener(CART_OPEN_EVENT, openListener as EventListener);
    window.addEventListener(CART_TOGGLE_EVENT, toggleListener as EventListener);
    return () => {
      window.removeEventListener("hashchange", applyHash);
      window.removeEventListener(CART_OPEN_EVENT, openListener as EventListener);
      window.removeEventListener(CART_TOGGLE_EVENT, toggleListener as EventListener);
    };
  }, []);

  // Persist drawer state so a refresh keeps current open/closed status
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(DRAWER_STATE_KEY, drawerOpen ? "1" : "0");
    } catch {}
  }, [drawerOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-10 sm:mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent mb-3 sm:mb-4"
        >
          Boutique de l&apos;association
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4"
        >
          Soutenez nos actions en vous faisant plaisir.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {catalog.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={(prod) => add({ product: prod, quantity: 1 })}
            isHighlighted={highlightedProductId != null && String(p.id) === String(highlightedProductId)}
          />
        ))}
      </div>

      {/* Floating Cart Button (hidden on mobile, shown from sm+) */}
      <motion.button
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setDrawerOpen((v) => !v)}
        aria-label="Ouvrir le panier"
        className="hidden sm:flex fixed z-50 bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] md:bottom-[calc(2rem+env(safe-area-inset-bottom))] md:right-[calc(2rem+env(safe-area-inset-right))] rounded-full bg-[#0f172a] text-white shadow-xl shadow-black/20 px-4 pl-4 pr-3 py-2.5 items-center gap-2.5 backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/95 cursor-pointer"
      >
        <ShoppingCart className="w-4 h-4" aria-hidden />
        <span className="text-sm font-semibold">Panier</span>
        <motion.span
          key={totalQuantity}
          initial={{ scale: 0.9, opacity: 0.9 }}
          animate={{ scale: [1, 1.5, 1], opacity: 1 }}
          transition={{ duration: 0.35 }}
          aria-live="polite"
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-theme-red to-theme-yellow text-white text-xs font-extrabold shadow"
        >
          {totalQuantity}
        </motion.span>
      </motion.button>

      {/* Drawer */}
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onUpdate={update}
        onRemove={remove}
        onClear={clear}
      />
    </div>
  );
}



