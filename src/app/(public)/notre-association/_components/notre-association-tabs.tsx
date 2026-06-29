"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"

import AboutUsSection from "@/components/association/AboutUsSection"
import ActivityReportsSection from "@/components/association/ActivityReportsSection"
import PresidentSection from "@/components/association/PresidentSection"
import TeamSection from "@/components/association/TeamSection"
import { PageHeroMagicTitle, PAGE_HERO_SLIDER_VARIANT } from "@/components/page-hero-magic-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DEFAULT_TAB = "president"
const VALID_TABS = ["president", "about", "reports", "team"] as const

type AssociationTab = (typeof VALID_TABS)[number]

const TABS: ReadonlyArray<{ id: AssociationTab; label: string }> = [
  { id: "president", label: "Le Président" },
  { id: "about", label: "Qui sommes-nous ?" },
  { id: "reports", label: "Rapport d'activité" },
  { id: "team", label: "Notre équipe" },
]

function isValidTab(value: string | null): value is AssociationTab {
  return value !== null && VALID_TABS.includes(value as AssociationTab)
}

function NotreAssociationTabsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabFromUrl = searchParams.get("tab")

  const tabFromUrlValue = isValidTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB
  const [activeTab, setActiveTab] = useState<AssociationTab>(tabFromUrlValue)

  const handleTabChange = useCallback(
    (newTab: string) => {
      if (!isValidTab(newTab) || newTab === activeTab) return

      setActiveTab(newTab)

      const params = new URLSearchParams(searchParams.toString())

      if (newTab === DEFAULT_TAB) {
        params.delete("tab")
      } else {
        params.set("tab", newTab)
      }

      const query = params.toString()
      router.replace(query ? `/notre-association?${query}` : "/notre-association", {
        scroll: false,
      })
    },
    [activeTab, router, searchParams],
  )

  useEffect(() => {
    setActiveTab(tabFromUrlValue)
  }, [tabFromUrlValue])

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
          <PageHeroMagicTitle
            text="Notre association"
            variant={PAGE_HERO_SLIDER_VARIANT.association}
            className="mb-4"
          />
          <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed sm:mt-4 sm:text-lg">
            Découvrez notre histoire, nos valeurs et les personnes qui font vivre
            l&apos;association
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full min-w-0">
          <div className="min-w-0">
            <div className="mx-auto max-w-4xl">
              <TabsList
                className="
                  flex h-auto w-full snap-x snap-mandatory flex-nowrap justify-start gap-1.5 overflow-x-auto overflow-y-hidden rounded-2xl border border-border/60 bg-muted/45 p-1.5 shadow-sm
                  [-ms-overflow-style:none] [scrollbar-width:none]
                  sm:justify-center sm:gap-2 sm:p-2
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="
                      shrink-0 snap-center cursor-pointer rounded-xl border border-transparent px-3 py-2.5 font-semibold text-muted-foreground text-xs
                      shadow-none transition-all duration-200
                      hover:border-border/60 hover:bg-background/80 hover:text-foreground hover:shadow-sm
                      focus-visible:ring-2 focus-visible:ring-theme-green/35
                      active:scale-[0.98]
                      data-[state=active]:border-theme-green/30 data-[state=active]:bg-background data-[state=active]:text-theme-green data-[state=active]:shadow-md
                      dark:data-[state=active]:text-theme-green-light
                      sm:px-4 sm:py-3 sm:text-sm lg:px-5 lg:text-base
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

function NotreAssociationTabsFallback() {
  return (
    <div className="relative min-h-screen bg-background py-7 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse text-center">
          <div className="mx-auto mb-4 h-14 max-w-md rounded-2xl bg-muted sm:mb-5" />
          <div className="mx-auto h-14 max-w-lg rounded-xl bg-muted/70" />
        </div>
        <div className="mx-auto mt-9 min-h-[14rem] max-w-5xl animate-pulse rounded-xl bg-muted/40 sm:mt-11 md:min-h-[16rem]" />
      </div>
    </div>
  )
}

/**
 * Onglets de la page « Notre association » avec synchronisation URL.
 */
export function NotreAssociationTabs() {
  return (
    <Suspense fallback={<NotreAssociationTabsFallback />}>
      <NotreAssociationTabsContent />
    </Suspense>
  )
}
