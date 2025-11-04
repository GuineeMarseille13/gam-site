"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem } from "../_schemas/product.schema";
import {
  addOrUpdateItem,
  clearCart,
  readCart,
  removeItem,
  writeCart,
  type PersistedCart,
} from "../_services/cart-storage";
import { CART_UPDATED_EVENT } from "../_services/cart-storage";

interface UseCartResult {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  add: (item: CartItem) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

function computeTotals(items: CartItem[]): { totalQuantity: number; totalPrice: number } {
  const totals = items.reduce(
    (acc, it) => {
      acc.totalQuantity += it.quantity;
      acc.totalPrice += it.quantity * it.product.price;
      return acc;
    },
    { totalQuantity: 0, totalPrice: 0 }
  );
  return totals;
}

export function useCart(): UseCartResult {
  const [items, setItems] = useState<PersistedCart>([]);
  const [hydrated, setHydrated] = useState(false);
  const isExternalUpdateRef = useRef(false);

  // Hydrate from localStorage once on client
  useEffect(() => {
    setItems(readCart());
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    if (isExternalUpdateRef.current) {
      // Skip persisting when the change originated from a global "cart:updated" event
      isExternalUpdateRef.current = false;
      return;
    }
    writeCart(items);
  }, [items, hydrated]);

  // Listen to global cart updates to stay in sync across components
  useEffect(() => {
    const handler = () => {
      isExternalUpdateRef.current = true;
      const fresh = readCart();
      // Avoid useless state updates if identical length and shallow-equal items
      const same =
        items.length === fresh.length &&
        items.every((it, idx) =>
          it.product.id === fresh[idx]?.product.id && it.quantity === fresh[idx]?.quantity
        );
      if (!same) {
        setItems(fresh);
      } else {
        // If nothing changed, clear the external flag to avoid blocking next write
        isExternalUpdateRef.current = false;
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener(CART_UPDATED_EVENT, handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(CART_UPDATED_EVENT, handler);
      }
    };
  }, [items]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.product.id === item.product.id);
      const currentQty = existing?.quantity ?? 0;
      const inc = item.quantity ?? 1;
      const nextQty = Math.min(99, currentQty + inc);
      return addOrUpdateItem(prev, { product: item.product, quantity: nextQty });
    });
  }, []);

  const update = useCallback((productId: string, quantity: number) => {
    setItems((prev) => addOrUpdateItem(prev, { product: prev.find(p => p.product.id === productId)?.product ?? { id: productId, name: "", image: "", price: 0 }, quantity }));
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => removeItem(prev, productId));
  }, []);

  const clear = useCallback(() => {
    clearCart();
    setItems([]);
  }, []);

  const { totalPrice, totalQuantity } = useMemo(() => computeTotals(items), [items]);

  return { items, totalPrice, totalQuantity, add, update, remove, clear };
}


