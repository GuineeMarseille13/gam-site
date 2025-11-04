"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, ArrowLeft, CreditCard, CheckCircle2, Trash2 } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { CartItem, CheckoutData } from "../_schemas/product.schema";
import { checkoutDataSchema } from "../_schemas/product.schema";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onUpdate: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export function CartDrawer({ open, onClose, items, totalPrice, onUpdate, onRemove, onClear }: CartDrawerProps) {
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [form, setForm] = useState<CheckoutData>({ firstName: "", lastName: "", phone: undefined, email: undefined });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  const formattedTotal = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalPrice),
    [totalPrice]
  );

  const totalQty = useMemo(() => items.reduce((acc, it) => acc + it.quantity, 0), [items]);

  // Lock background scroll and apply page blur when drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = checkoutDataSchema.safeParse(form);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      setErrors(Object.fromEntries(Object.entries(flat.fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])));
      return;
    }
    // simulate success (no backend)
    onClear();
    setStep("done");
  };

  useEffect(() => setMounted(true), []);

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9995]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key="drawer"
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[10000] shadow-xl flex flex-col overflow-hidden overscroll-contain"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-label="Panier"
          >
            <div className="sticky top-0 z-10 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  {step !== "cart" ? (
                    <button
                      aria-label="Retour au panier"
                      className="rounded-md p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setStep("cart")}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <ShoppingCart className="w-5 h-5 text-gray-900" aria-hidden />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate leading-6">
                      {step === "cart" ? "Votre panier" : step === "checkout" ? "Validation" : "Merci !"}
                    </h3>
                    {step !== "done" && (
                      <p className="text-xs text-gray-600">
                        {totalQty} article{totalQty > 1 ? "s" : ""} · {formattedTotal}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {step === "checkout" && (
                    <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span>Paiement simulé</span>
                    </div>
                  )}
                  <button
                    aria-label="Fermer le panier"
                    onClick={onClose}
                    className="rounded-md p-2 hover:bg-gray-100 cursor-pointer transition-transform active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="px-4 pb-3 flex items-center gap-2 text-xs">
                <span className={`px-2.5 py-1 rounded-full ring-1 ${step === "cart" ? "bg-gray-900 text-white ring-gray-900/10" : "bg-gray-100 text-gray-700 ring-gray-200"}`}>Panier</span>
                <span className="text-gray-300">→</span>
                <span className={`px-2.5 py-1 rounded-full ring-1 ${step === "checkout" ? "bg-gray-900 text-white ring-gray-900/10" : "bg-gray-100 text-gray-700 ring-gray-200"}`}>Validation</span>
                <span className="text-gray-300">→</span>
                <span className={`px-2.5 py-1 rounded-full ring-1 ${step === "done" ? "bg-gray-900 text-white ring-gray-900/10" : "bg-gray-100 text-gray-700 ring-gray-200"}`}>Merci</span>
              </div>
            </div>

            {step === "cart" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="h-full min-h-[50vh] flex items-center justify-center">
                      <div className="text-center max-w-sm mx-auto">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 shadow"
                        >
                          <ShoppingCart className="w-7 h-7" />
                        </motion.div>
                        <h4 className="mt-4 text-base font-semibold text-gray-900">Votre panier est vide</h4>
                        <p className="mt-1 text-sm text-gray-600">Ajoutez des articles depuis la boutique pour commencer.</p>
                        <div className="mt-4">
                          <button
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:opacity-95 cursor-pointer"
                          >
                            Continuer mes achats
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    items.map((it) => (
                      <div key={it.product.id} className="flex items-center justify-between gap-2 sm:gap-3 rounded-lg border p-2.5 sm:p-3 hover:shadow-sm transition-shadow">
                        {/* Left: thumbnail + name + unit price */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="relative h-16 w-16 shrink-0 aspect-square p-1 rounded-md bg-gray-100 overflow-hidden">
                            <Image
                              src={it.product.image}
                              alt={it.product.name}
                              fill
                              className="object-contain"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 line-clamp-2 sm:line-clamp-1">{it.product.name}</div>
                            <div className="text-xs text-gray-600">{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(it.product.price)} / unité</div>
                          </div>
                        </div>

                        {/* Right: qty controls + line total + remove */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center rounded-md border bg-white">
                            <button
                              aria-label="Diminuer la quantité"
                              className="px-1.5 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                              onClick={() => onUpdate(it.product.id, Math.max(1, it.quantity - 1))}
                              disabled={it.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="min-w-8 text-center text-sm tabular-nums">{it.quantity}</span>
                            <button
                              aria-label="Augmenter la quantité"
                              className="px-1.5 py-1 text-gray-700 hover:bg-gray-50 cursor-pointer"
                              onClick={() => onUpdate(it.product.id, Math.min(99, it.quantity + 1))}
                            >
                              +
                            </button>
                          </div>
                          <div className="hidden sm:block text-xs sm:text-sm font-medium text-gray-900 min-w-[56px] text-right">
                            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(it.quantity * it.product.price)}
                          </div>
                          <button
                            aria-label="Retirer l'article"
                            title="Retirer"
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() => onRemove(it.product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t p-4 space-y-3 sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-semibold text-gray-900">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setStep("checkout")}
                      disabled={items.length === 0}
                      title="Valider le panier"
                      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 text-white font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-amber-500 active:scale-95 transition-all ring-1 ring-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Valider le panier</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "checkout" && (
              <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Prénom</label>
                    <input
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      required
                    />
                    {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nom</label>
                    <input
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      required
                    />
                    {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Téléphone (optionnel)</label>
                    <input
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      value={form.phone ?? ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value || undefined })}
                      inputMode="tel"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email (optionnel)</label>
                    <input
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      value={form.email ?? ""}
                      onChange={(e) => setForm({ ...form, email: e.target.value || undefined })}
                      type="email"
                      inputMode="email"
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>
                  <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-900">
                    Paiement simulé: les informations sont collectées pour finaliser le panier, aucun enregistrement serveur.
                  </div>
                </div>
                <div className="border-t p-4 flex gap-2">
                  <button type="button" onClick={() => setStep("cart")} className="flex-1 rounded-md border px-3 py-2 text-sm cursor-pointer">Retour</button>
                  <button type="submit" title="Procéder au paiement" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-theme-red to-theme-yellow text-white font-semibold shadow-sm hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-theme-yellow cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    <span>Payer {formattedTotal}</span>
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-emerald-600">
                  <CheckCircle2 className="w-14 h-14" />
                </motion.div>
                <h4 className="mt-3 text-lg font-semibold">Merci pour votre soutien !</h4>
                <p className="text-sm text-gray-600 mt-2">Votre commande simulée a été enregistrée localement. Un membre de l'association pourra vous contacter si besoin.</p>
                <button onClick={onClose} className="mt-6 rounded-md bg-gray-900 text-white px-4 py-2 text-sm cursor-pointer">Fermer</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  if (mounted && typeof document !== "undefined") {
    return createPortal(content, document.body);
  }
  return content;
}


