"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getCatalog } from "../_services/products";
import { ShoppingCart } from "lucide-react";
import { CART_OPEN_EVENT, CART_TOGGLE_EVENT } from "../_services/cart-storage";
import { useCart } from "../_hooks/use-cart";
import { ProductCard } from "./product-card";
import { CartDrawer } from "./cart-drawer";

export function BoutiqueView() {
  const catalog = useMemo(() => getCatalog(), []);
  const { items, totalPrice, totalQuantity, add, update, remove, clear } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const DRAWER_STATE_KEY = "boutique.drawer.open.v1";

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
      <div className="relative text-center mb-10">
        {/* subtle halo */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-24 w-72 md:w-96 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 blur-2xl opacity-60" />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent drop-shadow-sm"
        >
          Boutique de l'association
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-3 text-gray-600 max-w-2xl mx-auto"
        >
          Soutenez nos actions en vous faisant plaisir.
        </motion.p>
        {/* divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catalog.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={(prod) => add({ product: prod, quantity: 1 })} />)
        )}
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



