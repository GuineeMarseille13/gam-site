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
 * Récupère les éléments du carrousel (page HOME, section CAROUSEL, actifs)
 */
export async function getCarouselItems(): Promise<CarouselItem[]> {
  try {
    const where   = encodeURIComponent(JSON.stringify({ page: 'HOME', section: 'CAROUSEL', isActive: true }))
    const orderBy = encodeURIComponent(JSON.stringify({ order: 'asc' }))
    const response = await fetch(`/api/images?where=${where}&orderBy=${orderBy}`, { cache: 'no-store' })
    if (!response.ok) return []
    const data = await response.json()
    if (!Array.isArray(data)) return []
    return data.map((img: any) => ({
      id:          img.id,
      image:       img.url,
      title:       img.title       ?? '',
      description: img.description ?? '',
      order:       img.order       ?? 0,
      isActive:    img.isActive    ?? true,
    }))
  } catch {
    return []
  }
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

const VALID_COLORS = ['red', 'yellow', 'green', 'blue'] as const;

/**
 * Récupère les statistiques actives depuis la base de données.
 */
export async function getStatistics(): Promise<Statistic[]> {
  try {
    const response = await fetch('/api/achievements', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((a: any) => a.isActive && a.label && a.value != null)
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      .map((a: any) => ({
        id: a.id,
        label: a.label,
        value: a.value,
        color: (VALID_COLORS.includes(a.color) ? a.color : 'blue') as Statistic['color'],
        icon: a.icon ?? '📊',
        suffix: a.suffix ?? undefined,
        order: a.order ?? 0,
        isActive: true,
      }));
  } catch {
    return [];
  }
}

/**
 * Récupère les bénévoles à afficher sur le site public (showOnSite=true, avec photo)
 */
export async function getVolunteers(): Promise<Volunteer[]> {
  try {
    const response = await fetch('/api/volunteers/public', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export interface VideoTestimonial {
  id: string;
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  order: number;
}

/**
 * Récupère les témoignages vidéo (page HOME, section REVIEW)
 */
export async function getVideoTestimonials(): Promise<VideoTestimonial[]> {
  try {
    const where = encodeURIComponent(JSON.stringify({ page: 'HOME', section: 'REVIEW', isActive: true }));
    const orderBy = encodeURIComponent(JSON.stringify({ order: 'asc' }));
    const response = await fetch(`/api/videos?where=${where}&orderBy=${orderBy}`, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((v: any) => ({
      id: v.id,
      url: v.url,
      title: v.title ?? undefined,
      description: v.description ?? undefined,
      thumbnail: v.thumbnail ?? undefined,
      order: v.order ?? 0,
    }));
  } catch {
    return [];
  }
}

export interface SocialMediaItem {
  id: string
  name: string
  url: string
  icon: string | null
  order: number
}

/**
 * Récupère les réseaux sociaux triés par ordre d'affichage.
 */
export async function getSocialMedias(): Promise<SocialMediaItem[]> {
  try {
    const orderBy = encodeURIComponent(JSON.stringify({ order: 'asc' }))
    const response = await fetch(`/api/social-medias?orderBy=${orderBy}`, { cache: 'no-store' })
    if (!response.ok) return []
    const data = await response.json()
    const items = Array.isArray(data) ? data : data?.data ?? []
    return items.map((sm: any) => ({
      id: sm.id,
      name: sm.name,
      url: sm.url,
      icon: sm.icon ?? null,
      order: sm.order ?? 0,
    }))
  } catch {
    return []
  }
}

/**
 * Récupère les produits en vedette
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products?active=true&inStock=true', { cache: 'no-store' });
    if (!response.ok) return [];
    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch {
    return [];
  }
}

