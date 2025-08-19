"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Contacts", href: "/contacts", icon: "📞" },
  { label: "Notre association", href: "/association", icon: "🏛️" },
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

  return (
    <>
      {/* Navigation Desktop - conditionnellement rendue */}
      {!isMobile && (
        <nav className="bg-gray-50 dark:bg-gray-900 py-4 bg-white/10 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
              {!isHome && (
                <motion.li
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
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <span>{currentPageInfo.icon}</span>
                  <span>{currentPageInfo.label}</span>
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
