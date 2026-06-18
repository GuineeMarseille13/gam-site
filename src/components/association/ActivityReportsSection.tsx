"use client"

import { useCallback, useState } from "react"
import { motion } from "motion/react"
import { Eye, FileText, Loader2 } from "lucide-react"
import { cn } from "@/helpers/utils"
import type { ActivityReportPublic } from "@/app/(public)/notre-association/_schemas/activity-report-public.schema"
import { Button } from "@/components/ui/button"
import { AssociationSectionTitle } from "@/components/association/association-section-title"
import { ActivityReportsPreviewSheet } from "@/components/association/activity-reports-preview-sheet"
import { useActivityReportsPublic } from "@/app/(public)/notre-association/_hooks/use-activity-reports-public"

function reportTitle(year: number, label: string | null | undefined): string {
  const t = label?.trim()
  return t && t.length > 0 ? t : `Rapport d'activités ${year}`
}

/**
 * Liste des rapports d’activité (PDF) : données issues de l’API, tri par année,
 * accent sur l’année la plus récente. L’icône œil ouvre l’aperçu dans un panneau latéral.
 */
export default function ActivityReportsSection() {
  const { data: activityReports, isLoading, isError, error } = useActivityReportsPublic()
  const [previewReport, setPreviewReport] = useState<ActivityReportPublic | null>(null)

  const handleOpenPreview = useCallback((report: ActivityReportPublic) => {
    setPreviewReport(report)
  }, [])

  const handlePreviewOpenChange = useCallback((open: boolean) => {
    if (!open) setPreviewReport(null)
  }, [])

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-theme-green" aria-hidden />
        <p className="text-sm">Chargement des rapports…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-10 text-center text-sm text-destructive">
        {error instanceof Error ? error.message : "Impossible de charger les rapports d’activité."}
      </div>
    )
  }

  const reports = activityReports ?? []
  const latestYear = reports.length > 0 ? Math.max(...reports.map((r) => r.year)) : null

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full min-w-0 max-w-7xl px-0"
      >
        <AssociationSectionTitle
          title="Rapport d'activité"
          description="Consultez nos rapports annuels pour découvrir nos réalisations et notre impact."
          animationDelay={0.08}
        />

        {reports.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border/60 bg-muted/25 px-5 py-10 text-center text-muted-foreground text-base">
            Aucun rapport disponible pour le moment.
          </div>
        ) : (
          <>
            <ul
              className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/40 bg-card/50 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.03] dark:bg-card/20 dark:shadow-black/30 dark:ring-white/[0.04]"
              role="list"
            >
              {reports.map((report, index) => {
                const title = reportTitle(report.year, report.label)
                const isLatest = latestYear !== null && report.year === latestYear

                return (
                  <motion.li
                    key={report.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.35 }}
                    className="border-border/30 border-b last:border-b-0"
                  >
                    <div
                      className={cn(
                        "group flex min-w-0 items-center gap-3 px-4 py-3.5 transition-[background-color,box-shadow] duration-200 sm:gap-4 sm:px-5 sm:py-4",
                        "hover:bg-muted/45",
                        isLatest &&
                          "bg-gradient-to-r from-theme-green/[0.14] via-theme-green/[0.06] to-transparent dark:from-theme-green/18 dark:via-theme-green/8",
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-theme-green to-theme-green-dark text-white shadow-md sm:size-11",
                            "ring-1 ring-black/[0.06] transition-transform duration-200 group-hover:scale-[1.03] dark:ring-white/15",
                          )}
                          aria-hidden
                        >
                          <FileText className="size-4 sm:size-[1.125rem]" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                            <span
                              className={cn(
                                "font-semibold text-foreground text-base leading-snug sm:text-lg",
                                isLatest && "text-theme-green dark:text-theme-green-light",
                              )}
                            >
                              {title}
                            </span>
                          </span>
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-9 rounded-full border-border/50 shadow-sm sm:size-10"
                          onClick={() => handleOpenPreview(report)}
                          aria-label={`Aperçu du rapport : ${title}, année ${report.year}`}
                        >
                          <Eye className="size-4 sm:size-[1.125rem]" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </ul>

            <ActivityReportsPreviewSheet
              report={previewReport}
              onOpenChange={handlePreviewOpenChange}
              displayTitle={(r) => reportTitle(r.year, r.label)}
            />
          </>
        )}
      </motion.div>
    </div>
  )
}
