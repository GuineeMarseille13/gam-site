"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AboutUsSection from "@/components/association/AboutUsSection"
import ActivityReportsSection from "@/components/association/ActivityReportsSection"
import PresidentSection from "@/components/association/PresidentSection"
import TeamSection from "@/components/association/TeamSection"
import { AssociationMagicTitle } from "@/components/association/association-magic-title"

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

      <div className="relative mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-9 lg:px-8 lg:py-11">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-7 max-w-3xl text-center sm:mb-9 md:mb-10"
        >
          <h1 className="flex w-full min-w-0 justify-center px-1 text-balance font-bold leading-[1.06] tracking-tight sm:px-2">
            <AssociationMagicTitle
              text="Notre Association"
              variant="hero"
              className="max-w-full justify-center"
            />
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed sm:mt-4 sm:text-lg">
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
                      shrink-0 snap-center rounded-none border-0 px-2.5 py-2 font-medium text-muted-foreground text-xs shadow-none
                      transition-colors duration-200
                      after:h-0.5 after:rounded-full
                      hover:text-foreground
                      data-[state=active]:text-theme-green data-[state=active]:shadow-none
                      data-[state=active]:after:bg-theme-green
                      dark:data-[state=active]:text-theme-green-light
                      dark:data-[state=active]:after:bg-theme-green-light
                      sm:px-4 sm:py-3 sm:text-sm lg:px-5 lg:py-3.5 lg:text-base
                    "
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="min-w-0 px-0 pt-7 sm:pt-9 md:pt-11">
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
        <div className="relative min-h-screen bg-background py-7 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl animate-pulse text-center">
              <div className="mx-auto mb-3 h-6 w-24 rounded-full bg-muted sm:mb-4" />
              <div className="mx-auto mb-4 h-11 max-w-md rounded-2xl bg-muted sm:mb-5" />
              <div className="mx-auto h-14 max-w-lg rounded-xl bg-muted/70" />
            </div>
            <div className="mx-auto mt-9 min-h-[14rem] max-w-5xl animate-pulse rounded-xl bg-muted/40 sm:mt-11 md:min-h-[16rem]" />
          </div>
        </div>
      }
    >
      <NotreAssociationContent />
    </Suspense>
  )
}
