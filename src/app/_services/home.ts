/**
 * Services pour récupérer les données de la page d'accueil
 */

export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  order: number;
  isActive: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  category?: string;
  categoryId?: string;
  order: number;
  isActive: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  year: number;
  category?: string;
  image?: string;
  video?: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  body: string;
  img?: string;
  country: string;
  rating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  isPublished: boolean;
  isFeatured: boolean;
}

export interface PoleItem {
  id: string;
  name: string;
  description?: string;
  imageId?: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: number;
  color: 'red' | 'yellow' | 'green' | 'blue';
  icon: string;
  suffix?: string;
  order: number;
  isActive: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  image: string;
  role?: string;
  initials: string;
  order: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  category?: string;
  inStock: boolean;
  featured: boolean;
  discount?: number;
}


const CLOUDINARY_BASE = 'https://res.cloudinary.com/df3ymbrqe/image/upload';

/**
 * Récupère les pôles d'activité
 */
export async function getPoles(): Promise<PoleItem[]> {
  try {
    const response = await fetch('/api/poles', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    // L'API retourne directement le tableau
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Récupère les éléments du carrousel
 */
export async function getCarouselItems(): Promise<CarouselItem[]> {
  // Route supprimée — le carrousel utilise ses données statiques intégrées
  return [];
}

/**
 * Récupère les partenaires
 */
export async function getPartners(): Promise<Partner[]> {
  try {
    const response = await fetch('/api/partners', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      logo: p.imageId ? `${CLOUDINARY_BASE}/${p.imageId}` : undefined,
      description: p.description ?? undefined,
      website: p.url ?? undefined,
      order: p.order ?? 0,
      isActive: p.isActive ?? true,
    }));
  } catch {
    return [];
  }
}

/**
 * Récupère les événements récents (limite à 5)
 */
export async function getRecentEvents(): Promise<Event[]> {
  try {
    const response = await fetch('/api/events', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5)
      .map((event: any) => {
        const startDate = new Date(event.startDate);
        return {
          id: event.id,
          title: event.title,
          description: event.description ?? '',
          date: startDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          location: event.location ?? undefined,
          year: startDate.getFullYear(),
          category: undefined,
          image: event.imageId ? `${CLOUDINARY_BASE}/${event.imageId}` : undefined,
          video: event.videoId ? `${CLOUDINARY_BASE}/${event.videoId}` : undefined,
        };
      });
  } catch {
    return [];
  }
}

/**
 * Récupère les témoignages publiés
 */
const RATING_MAP: Record<number, Review['rating']> = {
  1: 'ONE', 2: 'TWO', 3: 'THREE', 4: 'FOUR', 5: 'FIVE',
};

export async function getReviews(): Promise<Review[]> {
  try {
    const response = await fetch('/api/reviews', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((r: any) => r.isActive)
      .map((r: any) => ({
        id: r.id,
        name: `${r.firstName} ${r.lastName}`,
        role: r.role,
        body: r.body,
        img: r.avatarUrl || undefined,
        country: r.country ?? '',
        rating: RATING_MAP[r.rating] ?? 'FIVE',
        isPublished: r.isActive,
        isFeatured: r.isVerified ?? false,
      }));
  } catch {
    return [];
  }
}

/**
 * Récupère les statistiques actives
 */
export async function getStatistics(): Promise<Statistic[]> {
  // Route supprimée — StatisticsSection utilise ses données statiques intégrées
  return [];
}

/**
 * Récupère les bénévoles actifs
 */
export async function getVolunteers(): Promise<Volunteer[]> {
  try {
    const response = await fetch('/api/volunteers', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data.filter((v: any) => v.isActive) : [];
  } catch {
    return [];
  }
}

/**
 * Récupère les produits en vedette
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data.filter((p: any) => p.featured && p.inStock) : [];
  } catch {
    return [];
  }
}

