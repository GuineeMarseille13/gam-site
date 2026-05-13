"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AboutUsSection from "@/components/association/AboutUsSection"
import ActivityReportsSection from "@/components/association/ActivityReportsSection"
import PresidentSection from "@/components/association/PresidentSection"
import TeamSection from "@/components/association/TeamSection"

const DEFAULT_TAB = "president"
const VALID_TABS = ["president", "about", "reports", "team"]

function NotreAssociationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabFromUrl = searchParams.get("tab")

  const initialTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : DEFAULT_TAB

  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    const params = new URLSearchParams(searchParams.toString())
    if (newTab === DEFAULT_TAB) {
      params.delete("tab")
    } else {
      params.set("tab", newTab)
    }
    router.push(`/notre-association?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl])

  const tabs = [
    { id: "president", label: "Le Président" },
    { id: "about", label: "Qui sommes-nous ?" },
    { id: "reports", label: "Rapport d'activité" },
    { id: "team", label: "Notre équipe" },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,var(--theme-green)/14%,transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_-12%,var(--theme-green)/18%,transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
        >
          <h1 className="text-balance bg-gradient-to-br from-theme-green via-theme-green-dark to-theme-green bg-clip-text font-bold text-3xl text-transparent leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Notre Association
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed sm:mt-6 sm:text-lg">
            Découvrez notre histoire, nos valeurs et les personnes qui font vivre
            l&apos;association
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full min-w-0">
          <div className="min-w-0">
            <div className="relative border-border/50 border-b">
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-theme-green/20 to-transparent"
                aria-hidden
              />
              <TabsList
                variant="line"
                className="
                  flex h-auto w-full max-w-5xl snap-x snap-mandatory flex-nowrap justify-start gap-0 overflow-x-auto overflow-y-hidden rounded-none border-0 bg-transparent px-0 pb-0 pt-0
                  [-ms-overflow-style:none] [scrollbar-width:none]
                  sm:mx-auto sm:max-w-4xl sm:justify-center
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="
                      shrink-0 snap-center rounded-none border-0 px-3 py-3 font-medium text-muted-foreground text-xs shadow-none
                      transition-colors duration-200
                      after:h-0.5 after:rounded-full
                      hover:text-foreground
                      data-[state=active]:text-theme-green data-[state=active]:shadow-none
                      data-[state=active]:after:bg-theme-green
                      dark:data-[state=active]:text-theme-green-light
                      dark:data-[state=active]:after:bg-theme-green-light
                      sm:px-5 sm:py-4 sm:text-sm lg:text-lg
                    "
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="min-w-0 px-0 pt-10 sm:pt-12 md:pt-14">
              <TabsContent value="president" className="mt-0 outline-none">
                <PresidentSection />
              </TabsContent>

              <TabsContent value="about" className="mt-0 outline-none">
                <AboutUsSection />
              </TabsContent>

              <TabsContent value="reports" className="mt-0 outline-none">
                <ActivityReportsSection />
              </TabsContent>

              <TabsContent value="team" className="mt-0 outline-none">
                <TeamSection />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default function NotreAssociationPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-background py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl animate-pulse text-center">
              <div className="mx-auto mb-5 h-7 w-28 rounded-full bg-muted" />
              <div className="mx-auto mb-6 h-14 max-w-md rounded-2xl bg-muted" />
              <div className="mx-auto h-16 max-w-lg rounded-xl bg-muted/70" />
            </div>
            <div className="mx-auto mt-14 min-h-[18rem] max-w-5xl animate-pulse rounded-xl bg-muted/40 sm:mt-16" />
          </div>
        </div>
      }
    >
      <NotreAssociationContent />
    </Suspense>
  )
}
