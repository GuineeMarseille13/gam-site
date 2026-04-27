import type { Metadata } from "next"
import { Suspense } from "react"
import { getAdherentsForDashboard } from "@/lib/data/adherents"
import { AdherentsList } from "./_components/adherents-list"

export const metadata: Metadata = { title: "Adhérents" }

function AdherentsListFallback() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 xl:p-10">
      <div className="space-y-2">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted/60 sm:w-56" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted/40" />
      </div>
      <div className="h-11 max-w-md animate-pulse rounded-xl bg-muted/30" />
      <div className="min-h-[12rem] animate-pulse rounded-2xl bg-muted/20" />
    </div>
  )
}

export default async function AdherentsPage() {
  const adherents = await getAdherentsForDashboard()
  return (
    <Suspense fallback={<AdherentsListFallback />}>
      <AdherentsList adherents={adherents} />
    </Suspense>
  )
}
