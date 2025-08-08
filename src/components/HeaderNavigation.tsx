"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { label: "📞 Contacts", href: "/contacts" },
  { label: "🏛️ Notre association", href: "/association" },
  { label: "👥 Adhésion", href: "/adhesion" },
  { label: "🛒 Boutique", href: "/boutique" },
  { label: "💝 Faire un don", href: "/don" },
];

export default function HeaderNavigation() {
  const currentPath = usePathname();

  const isActive = (href: string) => currentPath === href;

  const isHome = currentPath === "/";

  return (
    <nav className="bg-gray-50 dark:bg-gray-900 py-4 z-50">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
          {!isHome && (
            <li>
              <Link
                href="/"
                className="px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                🏠 Accueil
              </Link>
            </li>
          )}
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`
                  px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 hover:shadow-md
                  ${
                    item.label.includes("Faire un don")
                      ? "donate-button-animated"
                      : ""
                  }
                  ${
                    isActive(item.href)
                      ? "bg-red-600 text-white hover:bg-red-700 border-2 border-red-600"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
