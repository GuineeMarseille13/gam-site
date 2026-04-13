/**
 * Services pour récupérer les données de la page d'accueil
 */

import { parseVideoUrl } from '@/lib/video-urls'

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

export interface EventMedia {
  id: number;
  type: 'image' | 'video';
  url: string;
  description?: string;
  embedUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  year: number;
  category?: string;
  /** Première image (rétro-compat) */
  image?: string;
  video?: string;
  /** Galerie complète (images + vidéo si présente) */
  media?: EventMedia[];
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

/**
 * Produit tel que renvoyé par GET /api/products (champs Prisma exposés au front).
 */
export interface FeaturedProductRecord {
  id: string
  title: string
  imageId: string | null
  price: number
  discountActive?: boolean
  discountPercent?: number
  description?: string | null
  stock?: number | null
}

const CLOUDINARY_BASE = 'https://res.cloudinary.com/df3ymbrqe/image/upload';

/** Tableau d’objets JSON issus des routes API internes. */
function asJsonObjectArray(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) return []
  return data.filter((x): x is Record<string, unknown> => typeof x === 'object' && x !== null)
}

function buildImageUrl(publicId: string) {
  return `${CLOUDINARY_BASE}/f_auto,q_auto/${publicId}`;
}

/** Construit le tableau media (images + vidéos YouTube/Vimeo + vidéo Cloudinary) pour un événement */
function buildEventMedia(
  images: { imageId: string }[],
  videos: { url: string }[] | undefined,
  imageId: string | null,
  videoId: string | null,
  title: string
): EventMedia[] {
  const result: EventMedia[] = [];
  let id = 0;

  // Vidéos externes (YouTube, Vimeo)
  if (videos?.length) {
    for (const v of videos) {
      const parsed = parseVideoUrl(v.url);
      if (parsed) {
        result.push({
          id: ++id,
          type: 'video',
          url: parsed.thumbnailUrl,
          embedUrl: parsed.embedUrl,
          description: title,
        });
      }
    }
  }

  // Vidéo Cloudinary (legacy)
  if (videoId) {
    result.push({
      id: ++id,
      type: 'video',
      url: `https://res.cloudinary.com/df3ymbrqe/video/upload/${videoId}`,
      description: title,
    });
  }

  if (images.length > 0) {
    images.forEach((img) => {
      result.push({
        id: ++id,
        type: 'image',
        url: buildImageUrl(img.imageId),
        description: title,
      });
    });
  } else if (imageId) {
    result.push({
      id: ++id,
      type: 'image',
      url: buildImageUrl(imageId),
      description: title,
    });
  }
  return result;
}

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
    return asJsonObjectArray(data).map((img) => ({
      id: String(img.id ?? ''),
      image: String(img.url ?? ''),
      title: typeof img.title === 'string' ? img.title : '',
      description: typeof img.description === 'string' ? img.description : '',
      order: typeof img.order === 'number' ? img.order : 0,
      isActive: typeof img.isActive === 'boolean' ? img.isActive : true,
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
    return asJsonObjectArray(data).map((p) => ({
      id: String(p.id ?? ''),
      name: typeof p.name === 'string' ? p.name : '',
      logo: typeof p.imageId === 'string' ? `${CLOUDINARY_BASE}/${p.imageId}` : undefined,
      description: typeof p.description === 'string' ? p.description : undefined,
      website: typeof p.url === 'string' ? p.url : undefined,
      order: typeof p.order === 'number' ? p.order : 0,
      isActive: typeof p.isActive === 'boolean' ? p.isActive : true,
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
    const rows = asJsonObjectArray(data);

    return rows
      .sort((a, b) => {
        const tb = new Date(String(b.startDate ?? '')).getTime()
        const ta = new Date(String(a.startDate ?? '')).getTime()
        return tb - ta
      })
      .slice(0, 5)
      .map((event) => {
        const startDate = new Date(String(event.startDate ?? ''))
        const title = typeof event.title === 'string' ? event.title : ''
        const images = Array.isArray(event.images)
          ? (event.images as { imageId: string }[])
          : []
        const videos = Array.isArray(event.videos)
          ? (event.videos as { url: string }[])
          : undefined
        const imageId = typeof event.imageId === 'string' ? event.imageId : null
        const videoId = typeof event.videoId === 'string' ? event.videoId : null
        const media = buildEventMedia(images, videos, imageId, videoId, title)
        return {
          id: String(event.id ?? ''),
          title,
          description: typeof event.description === 'string' ? event.description : '',
          date: startDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          location: typeof event.location === 'string' ? event.location : undefined,
          year: startDate.getFullYear(),
          category: undefined,
          image: media[0]?.type === 'image' ? media[0].url : (imageId ? `${CLOUDINARY_BASE}/${imageId}` : undefined),
          video: videoId ? `${CLOUDINARY_BASE}/${videoId}` : undefined,
          media: media.length > 0 ? media : undefined,
        }
      })
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
    const params = new URLSearchParams({
      where: JSON.stringify({ isActive: true }),
      include: JSON.stringify({ role: { select: { labelFr: true } } }),
      orderBy: JSON.stringify({ order: 'asc' }),
    })
    const response = await fetch(`/api/reviews?${params.toString()}`, { cache: 'no-store' })
    if (!response.ok) return []
    const data = await response.json()
    const rows = asJsonObjectArray(data)

    return rows.map((r) => {
      const first = typeof r.firstName === 'string' ? r.firstName : ''
      const last = typeof r.lastName === 'string' ? r.lastName : ''
      const ratingNum = typeof r.rating === 'number' ? r.rating : 5
      const roleObj = r.role
      const roleLabel =
        typeof roleObj === 'object' &&
        roleObj !== null &&
        'labelFr' in roleObj &&
        typeof (roleObj as { labelFr: unknown }).labelFr === 'string'
          ? (roleObj as { labelFr: string }).labelFr
          : ''
      return {
        id: String(r.id ?? ''),
        name: `${first} ${last}`.trim(),
        role: roleLabel,
        body: typeof r.body === 'string' ? r.body : '',
        img: typeof r.avatarUrl === 'string' ? r.avatarUrl : undefined,
        country: typeof r.country === 'string' ? r.country : '',
        rating: RATING_MAP[ratingNum] ?? 'FIVE',
        isPublished: r.isActive === true,
        isFeatured: r.isVerified === true,
      }
    })
  } catch {
    return []
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
    const rows = asJsonObjectArray(data);
    return rows
      .filter((a) => a.isActive === true && a.label != null && a.value != null)
      .sort((a, b) => (typeof a.order === 'number' ? a.order : 0) - (typeof b.order === 'number' ? b.order : 0))
      .map((a) => {
        const colorRaw = typeof a.color === 'string' ? a.color : 'blue'
        const color = (VALID_COLORS as readonly string[]).includes(colorRaw)
          ? (colorRaw as Statistic['color'])
          : 'blue'
        return {
          id: String(a.id ?? ''),
          label: String(a.label ?? ''),
          value: typeof a.value === 'number' ? a.value : Number(a.value),
          color,
          icon: typeof a.icon === 'string' ? a.icon : '📊',
          suffix: typeof a.suffix === 'string' ? a.suffix : undefined,
          order: typeof a.order === 'number' ? a.order : 0,
          isActive: true,
        }
      })
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
    return asJsonObjectArray(data).map((v) => ({
      id: String(v.id ?? ''),
      url: typeof v.url === 'string' ? v.url : '',
      title: typeof v.title === 'string' ? v.title : undefined,
      description: typeof v.description === 'string' ? v.description : undefined,
      thumbnail: typeof v.thumbnail === 'string' ? v.thumbnail : undefined,
      order: typeof v.order === 'number' ? v.order : 0,
    }))
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
    const rawItems = Array.isArray(data) ? data : (data as Record<string, unknown>)?.data
    const items = Array.isArray(rawItems) ? rawItems : []
    return asJsonObjectArray(items).map((sm) => ({
      id: String(sm.id ?? ''),
      name: typeof sm.name === 'string' ? sm.name : '',
      url: typeof sm.url === 'string' ? sm.url : '',
      icon: typeof sm.icon === 'string' ? sm.icon : null,
      order: typeof sm.order === 'number' ? sm.order : 0,
    }))
  } catch {
    return []
  }
}

/**
 * Récupère les produits en vedette
 */
export async function getFeaturedProducts(): Promise<FeaturedProductRecord[]> {
  try {
    const response = await fetch('/api/products?active=true&inStock=true', { cache: 'no-store' });
    if (!response.ok) return [];
    const result = await response.json() as { data?: unknown };
    const raw = result.data;
    if (!Array.isArray(raw)) return [];
    return raw.filter((x): x is FeaturedProductRecord => {
      if (typeof x !== 'object' || x === null) return false
      const o = x as Record<string, unknown>
      return typeof o.id === 'string' && typeof o.title === 'string' && typeof o.price === 'number'
    });
  } catch {
    return [];
  }
}

