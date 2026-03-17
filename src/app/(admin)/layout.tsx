import type { Metadata } from "next"
import { BureauSidebar } from "@/components/bureau/bureau-sidebar"
import { BureauHeader } from "@/components/bureau/bureau-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: {
    template: "%s | GAM Bureau",
    default: "Bureau administratif | GAM",
  },
  description: "Backoffice d'administration du site GAM",
  robots: { index: false, follow: false },
}

export default function BureauLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <BureauSidebar variant="inset" />
      <SidebarInset>
        <BureauHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
