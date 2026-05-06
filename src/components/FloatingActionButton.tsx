"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Home,
  Phone,
  Building,
  Users,
  ShoppingBag,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/helpers/utils";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Accueil", href: "/", icon: Home, color: "bg-blue-500" },
  { label: "Contacts", href: "/contacts", icon: Phone, color: "bg-green-500" },
  {
    label: "Association",
    href: "/association",
    icon: Building,
    color: "bg-purple-500",
  },
  { label: "Adhésion", href: "/adhesion", icon: Users, color: "bg-orange-500" },
  {
    label: "Boutique",
    href: "/boutique",
    icon: ShoppingBag,
    color: "bg-indigo-500",
  },
  { label: "Don", href: "/don", icon: Heart, color: "bg-red-500" },
];

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Floating Menu Items */}
      <div className="fixed bottom-24 right-6 z-50 md:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="flex flex-col-reverse gap-3 mb-4"
            >
              {navigationItems.map((item, index) => {
                const isActive = currentPath === item.href;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { delay: index * 0.05 },
                    }}
                    exit={{
                      opacity: 0,
                      y: 20,
                      scale: 0.8,
                      transition: {
                        delay: (navigationItems.length - index) * 0.03,
                      },
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      onClick={toggleMenu}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg",
                        "bg-white border border-gray-200 hover:shadow-xl transition-all",
                        "min-w-[140px] group",
                        isActive && "ring-2 ring-red-500 bg-red-50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white",
                          item.color,
                          isActive && "bg-red-500"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={cn(
                          "font-medium text-sm text-gray-700 group-hover:text-gray-900",
                          isActive && "text-red-600 font-semibold"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main FAB Button avec dégradé thématique */}
      <motion.button
        onClick={toggleMenu}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50",
          "bg-gradient-to-br from-theme-red via-theme-red to-theme-red-dark text-white",
          "flex items-center justify-center md:hidden",
          "hover:shadow-xl transition-all duration-200",
          "border-2 border-white/20 backdrop-blur-sm",
          "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-theme-yellow/20 before:to-theme-green/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
