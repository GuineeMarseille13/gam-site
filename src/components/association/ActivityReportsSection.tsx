"use client"

import { motion } from "motion/react"
import { Download, FileText } from "lucide-react"
import { activityReports } from "@/data/association"
import { cn } from "@/helpers/utils"
import Link from "next/link"

/**
 * Liste des rapports d’activité (PDF) : bloc lisible, lignes aérées,
 * accent doux sur l’année la plus récente.
 */
export default function ActivityReportsSection() {
  const latestYear = Math.max(...activityReports.map((r) => r.year))

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full min-w-0 max-w-7xl px-0"
      >
        <header className="mb-10 text-center sm:mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="mb-5 flex flex-col items-center justify-center gap-3 sm:mb-6 sm:flex-row sm:gap-4"
          >
            <div className="hidden h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-green-600 via-green-500 to-green-400 sm:block sm:h-12 md:h-14" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl sm:h-14 sm:w-14 md:h-16 md:w-16">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" aria-hidden />
            </div>
            <div className="hidden h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-green-600 via-green-500 to-green-400 sm:block sm:h-12 md:h-14" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="mb-4 text-balance break-words text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
              Rapport d&apos;activité
            </span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto h-1.5 w-32 origin-center rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent sm:w-40"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg"
          >
            Consultez nos rapports annuels pour découvrir nos réalisations et notre impact.
          </motion.p>
        </header>

        {activityReports.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border/60 bg-muted/25 px-5 py-10 text-center text-muted-foreground text-base">
            Aucun rapport disponible pour le moment.
          </div>
        ) : (
          <ul
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/40 bg-card/50 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.03] dark:bg-card/20 dark:shadow-black/30 dark:ring-white/[0.04]"
            role="list"
          >
            {activityReports.map((report, index) => {
              const isLatest = report.year === latestYear

              return (
                <motion.li
                  key={report.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.05, duration: 0.35 }}
                  className="border-border/30 border-b last:border-b-0"
                >
                  <Link
                    href={report.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir le rapport PDF : ${report.title}, année ${report.year}`}
                    className={cn(
                      "group flex min-w-0 items-center gap-4 px-4 py-3.5 transition-[background-color,box-shadow] duration-200 sm:gap-5 sm:px-5 sm:py-4",
                      "hover:bg-muted/45 focus-visible:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                      isLatest &&
                        "bg-gradient-to-r from-theme-green/[0.14] via-theme-green/[0.06] to-transparent dark:from-theme-green/18 dark:via-theme-green/8",
                    )}
                  >
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
                          {report.title}
                        </span>
                        <span className="text-muted-foreground text-sm tabular-nums sm:text-base">
                          Année {report.year}
                        </span>
                      </span>
                    </span>

                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background/90 text-muted-foreground shadow-sm transition-all duration-200 sm:size-10",
                        "group-hover:border-theme-green/35 group-hover:bg-theme-green group-hover:text-white group-hover:shadow-md",
                      )}
                      aria-hidden
                    >
                      <Download className="size-4 sm:size-[1.125rem]" />
                    </span>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        )}
      </motion.div>
    </div>
  )
}
