/**
 * Hooks pour toutes les sections
 * Sections : Welcome, Pole, Partner, Event, Review, Product, Achievement, Volunteer, TeamMember, ReportActivity, AboutUs
 */

import { createCrudResources } from './use-crud'
import type {
  WelcomeSection,
  PoleSection,
  PartnerSection,
  EventSection,
  ReviewSection,
  ProductSection,
  ProductCategory,
  AchievementSection,
  VolunteerSection,
  TeamMemberSection,
  ReportActivitySection,
  AboutUsSection,
} from '@/lib/generated/prisma/client'

// ============================================
// Welcome Section
// ============================================
const welcomeSectionCrud = createCrudResources<WelcomeSection>({
  endpoint: '/welcome-sections',
  queryKey: ['welcomeSections'],
})

export function useWelcomeSections() {
  return welcomeSectionCrud.useGetAll()
}

export function useWelcomeSection(id: string | null | undefined) {
  return welcomeSectionCrud.useGetById(id, {
    include: { reasons: true },
  })
}

export function useCreateWelcomeSection() {
  return welcomeSectionCrud.useCreate()
}

export function useUpdateWelcomeSection() {
  return welcomeSectionCrud.useUpdate()
}

export function useDeleteWelcomeSection() {
  return welcomeSectionCrud.useDelete()
}

// ============================================
// Pole Section
// ============================================
const poleSectionCrud = createCrudResources<PoleSection>({
  endpoint: '/pole-sections',
  queryKey: ['poleSections'],
})

export function usePoleSections() {
  return poleSectionCrud.useGetAll({
    include: { poles: true },
  })
}

export function usePoleSection(id: string | null | undefined) {
  return poleSectionCrud.useGetById(id, {
    include: { poles: true },
  })
}

export function useCreatePoleSection() {
  return poleSectionCrud.useCreate()
}

export function useUpdatePoleSection() {
  return poleSectionCrud.useUpdate()
}

export function useDeletePoleSection() {
  return poleSectionCrud.useDelete()
}

// ============================================
// Partner Section
// ============================================
const partnerSectionCrud = createCrudResources<PartnerSection>({
  endpoint: '/partner-sections',
  queryKey: ['partnerSections'],
})

export function usePartnerSections() {
  return partnerSectionCrud.useGetAll({
    include: { partners: true },
  })
}

export function usePartnerSection(id: string | null | undefined) {
  return partnerSectionCrud.useGetById(id, {
    include: { partners: true },
  })
}

export function useCreatePartnerSection() {
  return partnerSectionCrud.useCreate()
}

export function useUpdatePartnerSection() {
  return partnerSectionCrud.useUpdate()
}

export function useDeletePartnerSection() {
  return partnerSectionCrud.useDelete()
}

// ============================================
// Event Section
// ============================================
const eventSectionCrud = createCrudResources<EventSection>({
  endpoint: '/event-sections',
  queryKey: ['eventSections'],
})

export function useEventSections() {
  return eventSectionCrud.useGetAll({
    include: { events: true },
  })
}

export function useEventSection(id: string | null | undefined) {
  return eventSectionCrud.useGetById(id, {
    include: { events: true },
  })
}

export function useCreateEventSection() {
  return eventSectionCrud.useCreate()
}

export function useUpdateEventSection() {
  return eventSectionCrud.useUpdate()
}

export function useDeleteEventSection() {
  return eventSectionCrud.useDelete()
}

// ============================================
// Review Section
// ============================================
const reviewSectionCrud = createCrudResources<ReviewSection>({
  endpoint: '/review-sections',
  queryKey: ['reviewSections'],
})

export function useReviewSections() {
  return reviewSectionCrud.useGetAll({
    include: { reviews: true },
  })
}

export function useReviewSection(id: string | null | undefined) {
  return reviewSectionCrud.useGetById(id, {
    include: { reviews: true },
  })
}

export function useCreateReviewSection() {
  return reviewSectionCrud.useCreate()
}

export function useUpdateReviewSection() {
  return reviewSectionCrud.useUpdate()
}

export function useDeleteReviewSection() {
  return reviewSectionCrud.useDelete()
}

// ============================================
// Product Section
// ============================================
const productSectionCrud = createCrudResources<ProductSection>({
  endpoint: '/product-sections',
  queryKey: ['productSections'],
})

export function useProductSections() {
  return productSectionCrud.useGetAll({
    include: { products: true },
  })
}

export function useProductSection(id: string | null | undefined) {
  return productSectionCrud.useGetById(id, {
    include: { products: true },
  })
}

export function useCreateProductSection() {
  return productSectionCrud.useCreate()
}

export function useUpdateProductSection() {
  return productSectionCrud.useUpdate()
}

export function useDeleteProductSection() {
  return productSectionCrud.useDelete()
}

// ============================================
// Product Category
// ============================================
const productCategoryCrud = createCrudResources<ProductCategory>({
  endpoint: '/product-categories',
  queryKey: ['productCategories'],
})

export function useProductCategories() {
  return productCategoryCrud.useGetAll({
    include: { products: true },
  })
}

export function useProductCategory(id: string | null | undefined) {
  return productCategoryCrud.useGetById(id, {
    include: { products: true },
  })
}

export function useCreateProductCategory() {
  return productCategoryCrud.useCreate()
}

export function useUpdateProductCategory() {
  return productCategoryCrud.useUpdate()
}

export function useDeleteProductCategory() {
  return productCategoryCrud.useDelete()
}

// ============================================
// Achievement Section
// ============================================
const achievementSectionCrud = createCrudResources<AchievementSection>({
  endpoint: '/achievement-sections',
  queryKey: ['achievementSections'],
})

export function useAchievementSections() {
  return achievementSectionCrud.useGetAll({
    include: { achievements: true },
  })
}

export function useAchievementSection(id: string | null | undefined) {
  return achievementSectionCrud.useGetById(id, {
    include: { achievements: true },
  })
}

export function useCreateAchievementSection() {
  return achievementSectionCrud.useCreate()
}

export function useUpdateAchievementSection() {
  return achievementSectionCrud.useUpdate()
}

export function useDeleteAchievementSection() {
  return achievementSectionCrud.useDelete()
}

// ============================================
// Volunteer Section
// ============================================
const volunteerSectionCrud = createCrudResources<VolunteerSection>({
  endpoint: '/volunteer-sections',
  queryKey: ['volunteerSections'],
})

export function useVolunteerSections() {
  return volunteerSectionCrud.useGetAll({
    include: { volunteers: true },
  })
}

export function useVolunteerSection(id: string | null | undefined) {
  return volunteerSectionCrud.useGetById(id, {
    include: { volunteers: true },
  })
}

export function useCreateVolunteerSection() {
  return volunteerSectionCrud.useCreate()
}

export function useUpdateVolunteerSection() {
  return volunteerSectionCrud.useUpdate()
}

export function useDeleteVolunteerSection() {
  return volunteerSectionCrud.useDelete()
}

// ============================================
// Team Member Section
// ============================================
const teamMemberSectionCrud = createCrudResources<TeamMemberSection>({
  endpoint: '/team-member-sections',
  queryKey: ['teamMemberSections'],
})

export function useTeamMemberSections() {
  return teamMemberSectionCrud.useGetAll({
    include: { teamMembers: true },
  })
}

export function useTeamMemberSection(id: string | null | undefined) {
  return teamMemberSectionCrud.useGetById(id, {
    include: { teamMembers: true },
  })
}

export function useCreateTeamMemberSection() {
  return teamMemberSectionCrud.useCreate()
}

export function useUpdateTeamMemberSection() {
  return teamMemberSectionCrud.useUpdate()
}

export function useDeleteTeamMemberSection() {
  return teamMemberSectionCrud.useDelete()
}

// ============================================
// Report Activity Section
// ============================================
const reportActivitySectionCrud = createCrudResources<ReportActivitySection>({
  endpoint: '/report-activity-sections',
  queryKey: ['reportActivitySections'],
})

export function useReportActivitySections() {
  return reportActivitySectionCrud.useGetAll({
    include: { reports: true },
  })
}

export function useReportActivitySection(id: string | null | undefined) {
  return reportActivitySectionCrud.useGetById(id, {
    include: { reports: true },
  })
}

export function useCreateReportActivitySection() {
  return reportActivitySectionCrud.useCreate()
}

export function useUpdateReportActivitySection() {
  return reportActivitySectionCrud.useUpdate()
}

export function useDeleteReportActivitySection() {
  return reportActivitySectionCrud.useDelete()
}

// ============================================
// About Us Section
// ============================================
const aboutUsSectionCrud = createCrudResources<AboutUsSection>({
  endpoint: '/about-us-sections',
  queryKey: ['aboutUsSections'],
})

export function useAboutUsSections() {
  return aboutUsSectionCrud.useGetAll({
    include: { aboutUs: true },
  })
}

export function useAboutUsSection(id: string | null | undefined) {
  return aboutUsSectionCrud.useGetById(id, {
    include: { aboutUs: true },
  })
}

export function useCreateAboutUsSection() {
  return aboutUsSectionCrud.useCreate()
}

export function useUpdateAboutUsSection() {
  return aboutUsSectionCrud.useUpdate()
}

export function useDeleteAboutUsSection() {
  return aboutUsSectionCrud.useDelete()
}

