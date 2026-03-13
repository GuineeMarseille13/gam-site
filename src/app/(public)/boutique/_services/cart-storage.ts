"use client";

import { z } from "zod";
import { cartItemSchema } from "../_schemas/product.schema";

const STORAGE_KEY = "boutique.cart.v1";
export const CART_UPDATED_EVENT = "cart:updated";
export const CART_OPEN_EVENT = "cart:open";
export const CART_TOGGLE_EVENT = "cart:toggle";
export const CART_CLOSE_EVENT = "cart:close";

const cartSchema = z.array(cartItemSchema);
export type PersistedCart = z.infer<typeof cartSchema>;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readCart(): PersistedCart {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return cartSchema.parse(parsed);
  } catch {
    return [];
  }
}

export function writeCart(items: PersistedCart): void {
  if (!isBrowser()) return;
  const safe = cartSchema.parse(items);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  try {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  } catch {}
}

export function clearCart(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  try {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  } catch {}
}

export function addOrUpdateItem(
  items: PersistedCart,
  item: PersistedCart[number]
): PersistedCart {
  const index = items.findIndex((i) => i.product.id === item.product.id);
  if (index === -1) return [...items, item];
  const next = [...items];
  next[index] = { ...next[index], quantity: item.quantity };
  return next.filter((i) => i.quantity > 0);
}

export function removeItem(items: PersistedCart, productId: string): PersistedCart {
  return items.filter((i) => i.product.id !== productId);
}


