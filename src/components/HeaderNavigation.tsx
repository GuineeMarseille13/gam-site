"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/helpers/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/(public)/boutique/_hooks/use-cart";
import { CART_TOGGLE_EVENT } from "@/app/(public)/boutique/_services/cart-storage";

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Contacts", href: "/contacts", icon: "📞" },
  { label: "Notre association", href: "/notre-association", icon: "🏛️" },
  { label: "Adhésion", href: "/adhesion", icon: "👥" },
  { label: "Boutique", href: "/boutique", icon: "🛒" },
  { label: "Faire un don", href: "/don", icon: "💝" },
];

export default function HeaderNavigation() {
  const currentPath = usePathname();
  const isMobile = useIsMobile();

  const isActive = (href: string) => currentPath === href;
  const isHome = currentPath === "/";

  // Fonction pour obtenir les informations de la page courante
  const getCurrentPageInfo = () => {
    if (isHome) return { icon: "🏠", label: "Accueil" };

    const currentItem = navigationItems.find(
      (item) => item.href === currentPath
    );
    return currentItem
      ? { icon: currentItem.icon, label: currentItem.label }
      : { icon: "📄", label: "Page" };
  };

  const currentPageInfo = getCurrentPageInfo();

  const { totalQuantity } = useCart();

  return (
    <>
      {/* Navigation Desktop - conditionnellement rendue */}
      {!isMobile && (
        <nav className="bg-gray-50 dark:bg-gray-900 py-4 bg-white/10 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="flex w-full min-w-0 list-none flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-4">
              {!isHome && (
                <motion.li
                  className="shrink-0"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/"
                    className="px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  >
                    🏠 Accueil
                  </Link>
                </motion.li>
              )}
              {navigationItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  className="shrink-0"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 hover:shadow-md",
                      item.label === "Faire un don" &&
                        "donate-button-animated hover:scale-105",
                      isActive(item.href)
                        ? "bg-red-500 text-white ring-2 ring-red-300 border-2 border-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    )}
                  >
                    {item.icon} {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Indicateur de page mobile - conditionnellement rendu */}
      {isMobile && (
        <div className="bg-gray-50/50 dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700 backdrop-blur-lg">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {currentPath === "/boutique" ? (
              <div
                className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4"
                role="toolbar"
                aria-label="Navigation boutique et panier"
              >
                <MobileNavPageIndicator
                  icon={currentPageInfo.icon ?? ""}
                  label={currentPageInfo.label}
                />
                <MobileNavCartButton totalQuantity={totalQuantity} />
              </div>
            ) : (
              <div className="flex w-full justify-center px-1">
                <MobileNavPageIndicator
                  icon={currentPageInfo.icon ?? ""}
                  label={currentPageInfo.label}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface MobileNavPageIndicatorProps {
  icon: string;
  label: string;
}

/**
 * Pastille « page courante » (mobile) — réutilisée seule ou avec le panier boutique.
 */
function MobileNavPageIndicator({ icon, label }: MobileNavPageIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex max-w-[min(100vw-2rem,28rem)] shrink-0 items-center justify-center gap-2 px-3 py-1 text-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <motion.div
        className="h-2 w-2 shrink-0 rounded-full bg-red-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="flex min-w-0 items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
    </motion.div>
  );
}

interface MobileNavCartButtonProps {
  totalQuantity: number;
}

function MobileNavCartButton({ totalQuantity }: MobileNavCartButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          window.dispatchEvent(new CustomEvent(CART_TOGGLE_EVENT));
        } catch {}
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#0f172a] px-3 py-1.5 text-white shadow-sm hover:opacity-95 dark:bg-slate-800"
      aria-label="Ouvrir le panier"
    >
      <ShoppingCart className="h-4 w-4 shrink-0" />
      <span className="text-sm font-semibold">Panier</span>
      <motion.span
        key={totalQuantity}
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: [1, 1.2, 1], opacity: 1 }}
        transition={{ duration: 0.35 }}
        aria-live="polite"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-theme-red to-theme-yellow text-[10px] font-extrabold text-white shadow"
      >
        {totalQuantity}
      </motion.span>
    </button>
  );
}
