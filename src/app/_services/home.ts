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
  logo: string;
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
  img: string;
  country: string;
  rating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  isPublished: boolean;
  isFeatured: boolean;
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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Récupère les éléments du carrousel
 */
export async function getCarouselItems(): Promise<CarouselItem[]> {
  try {
    const response = await fetch('/api/carousel?active=true', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.warn('Erreur lors de la récupération du carrousel:', response.statusText);
      return [];
    }
    
    const result: ApiResponse<CarouselItem[]> = await response.json();
    if (!result.success || !result.data) {
      console.warn('Aucune donnée de carrousel disponible');
      return [];
    }
    return result.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du carrousel:', error);
    return [];
  }
}

/**
 * Récupère les partenaires
 */
export async function getPartners(): Promise<Partner[]> {
  const response = await fetch('/api/partners?active=true', {
    cache: 'no-store',
  });
  const result: ApiResponse<Partner[]> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Erreur lors de la récupération des partenaires');
  }
  return result.data;
}

/**
 * Récupère les événements récents (limite à 5)
 */
export async function getRecentEvents(): Promise<Event[]> {
  const response = await fetch('/api/events?published=true', {
    cache: 'no-store',
  });
  const result: ApiResponse<Event[]> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Erreur lors de la récupération des événements');
  }
  
  // Trier par date décroissante et limiter à 5
  const events = result.data
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Transformer les données pour correspondre au format attendu
  return events.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: new Date(event.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    location: event.location,
    year: event.year,
    category: event.category,
    image: event.media?.[0]?.url || undefined,
    video: event.media?.find((m: any) => m.type === 'video')?.url || undefined,
  }));
}

/**
 * Récupère les témoignages publiés
 */
export async function getReviews(): Promise<Review[]> {
  const response = await fetch('/api/reviews?published=true', {
    cache: 'no-store',
  });
  const result: ApiResponse<Review[]> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Erreur lors de la récupération des témoignages');
  }
  return result.data;
}

/**
 * Récupère les statistiques actives
 */
export async function getStatistics(): Promise<Statistic[]> {
  const response = await fetch('/api/statistics?active=true', {
    cache: 'no-store',
  });
  const result: ApiResponse<Statistic[]> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Erreur lors de la récupération des statistiques');
  }
  return result.data;
}

/**
 * Récupère les bénévoles actifs
 */
export async function getVolunteers(): Promise<Volunteer[]> {
  const response = await fetch('/api/volunteers?active=true', {
    cache: 'no-store',
  });
  const result: ApiResponse<Volunteer[]> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Erreur lors de la récupération des bénévoles');
  }
  return result.data;
}

/**
 * Récupère les produits en vedette
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await fetch('/api/products?featured=true&active=true&inStock=true', {
    cache: 'no-store',
  });
  const result: ApiResponse<Product[]> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Erreur lors de la récupération des produits');
  }
  return result.data;
}

