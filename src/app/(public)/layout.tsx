import { prisma } from "@/lib/prisma"
import BackgroundLogo from "@/components/BackgroundLogo"
import BannerCard from "@/components/BannerCard"
import type { BannerData } from "@/components/BannerCard"
import EventPromoOverlay from "@/components/EventPromoOverlay"
import type { PopupData } from "@/components/EventPromoOverlay"
import FloatingActionButton from "@/components/FloatingActionButton"
import Header from "@/components/Header"
import { EventMediaPreviewProvider } from "@/contexts/event-media-preview-context"

async function getActivePopup(): Promise<PopupData | null> {
  const popup = await prisma.popup.findFirst({ where: { isActive: true } })
  if (!popup) return null
  return {
    id:            popup.id,
    type:          popup.type,
    isActive:      popup.isActive,
    badge:         popup.badge,
    title:         popup.title,
    subtitle:      popup.subtitle,
    description:   popup.description,
    date:          popup.date,
    location:      popup.location,
    imageId:       popup.imageId,
    ctaLabel:      popup.ctaLabel,
    ctaUrl:        popup.ctaUrl,
    prospectusIds: popup.prospectusIds,
  }
}

async function getActiveBanner(): Promise<BannerData | null> {
  const banner = await prisma.banner.findFirst({ where: { isActive: true } })
  if (!banner) return null
  return {
    badge:    banner.badge,
    title:    banner.title,
    date:     banner.date,
    location: banner.location,
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [popup, banner] = await Promise.all([getActivePopup(), getActiveBanner()])

  return (
    <EventMediaPreviewProvider>
      <EventPromoOverlay popup={popup} />
      <BannerCard event={banner} />
      <BackgroundLogo />
      <Header />
      <main className="p-4 pt-2 relative z-10">{children}</main>
      <FloatingActionButton />
    </EventMediaPreviewProvider>
  )
}
