import BackgroundLogo from "@/components/BackgroundLogo"
import BannerCard from "@/components/BannerCard"
import EventPromoOverlay from "@/components/EventPromoOverlay"
import FloatingActionButton from "@/components/FloatingActionButton"
import Header from "@/components/Header"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <EventPromoOverlay />
      <BannerCard />
      <BackgroundLogo />
      <Header />
      <main className="p-4 pt-2 relative z-10">{children}</main>
      <FloatingActionButton />
    </>
  )
}
