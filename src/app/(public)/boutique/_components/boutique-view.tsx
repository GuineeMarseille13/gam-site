"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { CART_OPEN_EVENT, CART_TOGGLE_EVENT } from "../_services/cart-storage";
import { CART_ADDED_FEEDBACK_MS } from "../_constants/cart-feedback";
import { useCart } from "../_hooks/use-cart";
import { useActiveProducts } from "../_hooks/use-active-products";
import { ProductCard } from "./product-card";
import { CartDrawer } from "./cart-drawer";
import type { Product } from "../_schemas/product.schema";
import { PageHeroMagicTitle, PAGE_HERO_SLIDER_VARIANT } from "@/components/page-hero-magic-title";
import { SectionSplitTitleSeparator } from "@/components/section-split-heading";

/** Délai avant le scroll pour laisser le DOM se rendre (ms) */
const SCROLL_DELAY_MS = 150;

export function ShopView() {
  const { data: catalog = [] } = useActiveProducts();
  const products = useMemo<Product[]>(() => catalog, [catalog]);
  const { items, totalPrice, totalQuantity, add, update, remove, clear } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const DRAWER_STATE_KEY = "boutique.drawer.open.v1";
  const searchParams = useSearchParams();
  const router = useRouter();
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const urlHandledRef = useRef(false);
  const shouldScrollToProductRef = useRef(false);
  const highlightTimerRef = useRef<number | null>(null);

  const setProductHighlight = useCallback((productId: string, options?: { scroll?: boolean }) => {
    setHighlightedProductId(productId);
    if (options?.scroll) {
      shouldScrollToProductRef.current = true;
    }

    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
    }

    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightedProductId(null);
      highlightTimerRef.current = null;
    }, CART_ADDED_FEEDBACK_MS);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      add({ product, quantity: 1 });
      setProductHighlight(String(product.id));
    },
    [add, setProductHighlight],
  );

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  // 1) Traitement des paramètres URL (openCart, product) - une seule fois au mount
  useEffect(() => {
    if (typeof window === "undefined" || urlHandledRef.current) return;

    const openCartParam = searchParams.get("openCart");
    const productId = searchParams.get("product");

    if (productId) {
      setProductHighlight(productId, { scroll: true });
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
  }, [searchParams, router, setProductHighlight]);

  // Scroll vers le produit mis en évidence après redirection depuis l'accueil
  useEffect(() => {
    if (!highlightedProductId || !shouldScrollToProductRef.current || products.length === 0) return;

    const productIdStr = String(highlightedProductId);
    const hasProduct = products.some((p) => String(p.id) === productIdStr);
    if (!hasProduct) return;

    const scrollTimer = window.setTimeout(() => {
      const element = document.getElementById(`product-${productIdStr}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      shouldScrollToProductRef.current = false;
    }, SCROLL_DELAY_MS);

    return () => {
      window.clearTimeout(scrollTimer);
    };
  }, [highlightedProductId, products]);

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
      <div className="mb-10 w-full min-w-0 text-center sm:mb-12">
        <PageHeroMagicTitle
          text="Boutique de l'association"
          variant={PAGE_HERO_SLIDER_VARIANT.shop}
          className="w-full max-w-full"
        />
        <SectionSplitTitleSeparator tone="shop" className="mt-2 sm:mt-3" />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4"
        >
          Soutenez nos actions en vous faisant plaisir.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={handleAddToCart}
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



