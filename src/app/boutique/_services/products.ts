import { productSchema, type Product } from "../_schemas/product.schema";

const CATALOG: Product[] = [
  {
    id: "tshirt-classic",
    name: "T-shirt GAM — Classique",
    image: "/images/gam-logo.png",
    price: 20,
    description: "T-shirt coton avec logo de l'association.",
    category: "Textile",
    inStock: true,
    featured: true,
  },
  {
    id: "mug-solidarity",
    name: "Mug Solidarité",
    image: "/images/gam-logo.png",
    price: 12,
    description: "Mug en céramique, soutien aux actions.",
    category: "Goodies",
    inStock: true,
    discount: 10,
    originalPrice: 14,
  },
  {
    id: "bag-tote",
    name: "Tote bag éco-responsable",
    image: "/images/gam-logo.png",
    price: 8,
    description: "Sac réutilisable en coton bio.",
    category: "Accessoires",
    inStock: true,
  },
  {
    id: "hoodie-premium",
    name: "Hoodie GAM — Premium",
    image: "/images/aa-pole.jpg",
    price: 38,
    originalPrice: 45,
    description: "Sweat à capuche épais, idéal pour l'hiver.",
    category: "Textile",
    inStock: true,
    discount: 15,
  },
  {
    id: "cap-classic",
    name: "Casquette GAM",
    image: "/images/mr-pole.jpg",
    price: 16,
    description: "Casquette réglable, broderie fine.",
    category: "Accessoires",
    inStock: true,
  },
  {
    id: "sticker-pack",
    name: "Pack d'autocollants (x6)",
    image: "/images/gam-logo.png",
    price: 5,
    description: "Autocollants vinyles résistants à l'eau.",
    category: "Goodies",
    inStock: true,
  },
  {
    id: "notebook",
    name: "Carnet de notes A5",
    image: "/images/e-pole.jpg",
    price: 9,
    description: "Carnet 80 pages, papier recyclé.",
    category: "Papeterie",
    inStock: true,
  },
  {
    id: "bottle-steel",
    name: "Gourde inox 500ml",
    image: "/images/gam-logo.png",
    price: 22,
    description: "Isotherme, sans BPA, réutilisable.",
    category: "Goodies",
    inStock: true,
    featured: true,
  },
  {
    id: "pin-badge",
    name: "Pin's émaillé GAM",
    image: "/images/gam-logo.png",
    price: 4,
    description: "Petit pin's à accrocher, finition dorée.",
    category: "Goodies",
    inStock: true,
  },
];

export function getCatalog(): Product[] {
  // Validate at runtime to keep types safe
  return productSchema.array().parse(CATALOG);
}


