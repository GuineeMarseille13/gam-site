/**
 * Hooks React Query pour récupérer les données de la page d'accueil
 */

import { useQuery } from '@tanstack/react-query';
import {
  getCarouselItems,
  getPartners,
  getRecentEvents,
  getReviews,
  getStatistics,
  getVolunteers,
  getFeaturedProducts,
  type CarouselItem,
  type Partner,
  type Event,
  type Review,
  type Statistic,
  type Volunteer,
  type Product,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
 * Hook pour récupérer les produits en vedette
 */
export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

