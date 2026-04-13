/**
 * Hooks React Query pour récupérer les données de la page d'accueil
 */

import { useQuery } from '@tanstack/react-query';
import {
  getCarouselItems,
  getPartners,
  getPoles,
  getRecentEvents,
  getReviews,
  getStatistics,
  getVolunteers,
  getFeaturedProducts,
  getVideoTestimonials,
  getSocialMedias,
  type CarouselItem,
  type Partner,
  type PoleItem,
  type Event,
  type Review,
  type Statistic,
  type Volunteer,
  type FeaturedProductRecord,
  type VideoTestimonial,
  type SocialMediaItem,
} from '../_services/home';

/**
 * Hook pour récupérer les éléments du carrousel
 */
export function useCarouselItems() {
  return useQuery<CarouselItem[]>({
    queryKey: ['carousel-items'],
    queryFn: getCarouselItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les pôles d'activité
 */
export function usePoles() {
  return useQuery<PoleItem[]>({
    queryKey: ['poles'],
    queryFn: getPoles,
    staleTime: 10 * 60 * 1000, // 10 minutes (données stables)
  });
}

/**
 * Hook pour récupérer les partenaires
 */
export function usePartners() {
  return useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: getPartners,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les événements récents
 */
export function useRecentEvents() {
  return useQuery<Event[]>({
    queryKey: ['recent-events'],
    queryFn: getRecentEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les témoignages
 */
export function useReviews() {
  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: getReviews,
    staleTime: 60 * 1000,
 });
}

/**
 * Hook pour récupérer les statistiques
 */
export function useStatistics() {
  return useQuery<Statistic[]>({
    queryKey: ['statistics'],
    queryFn: getStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les bénévoles
 */
export function useVolunteers() {
  return useQuery<Volunteer[]>({
    queryKey: ['volunteers'],
    queryFn: getVolunteers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer les témoignages vidéo
 */
export function useVideoTestimonials() {
  return useQuery<VideoTestimonial[]>({
    queryKey: ['video-testimonials'],
    queryFn: getVideoTestimonials,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook pour récupérer les réseaux sociaux (footer + page contact)
 */
export function useSocialMedias() {
  return useQuery<SocialMediaItem[]>({
    queryKey: ['social-medias'],
    queryFn: getSocialMedias,
    staleTime: 10 * 60 * 1000, // 10 min — données stables
  });
}

/**
 * Hook pour récupérer les produits en vedette
 */
export function useFeaturedProducts() {
  return useQuery<FeaturedProductRecord[]>({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

