"use client"

import { format, parse } from "date-fns"
import { fr } from "date-fns/locale"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import type { BeneficiaryDemographicByMonthRow } from "../../_schemas/beneficiary-demographic-stats.schema"

/**
 * Couleurs lisibles clair/sombre (alignées bleu / vert / ambre — efficaces en barres groupées).
 * @see https://ui.shadcn.com/docs/components/radix/chart
 */
const chartConfig = {
  minor: {
    label: "Mineurs",
    theme: {
      light: "#2563eb",
      dark: "#60a5fa",
    },
  },
  adultAccompanied: {
    label: "Majeurs accompagnés",
    theme: {
      light: "#16a34a",
      dark: "#4ade80",
    },
  },
  unknownAge: {
    label: "Âge non renseigné",
    theme: {
      light: "#ca8a04",
      dark: "#fbbf24",
    },
  },
} satisfies ChartConfig

interface BeneficiaryDemographicMonthlyChartProps {
  rows: BeneficiaryDemographicByMonthRow[]
}

/**
 * Graphique en bâtons groupés par mois : trois séries (mineurs, majeurs accompagnés, âge non renseigné).
 * Pattern shadcn Chart + Recharts (tooltip, légende, grille, `accessibilityLayer`).
 */
export function BeneficiaryDemographicMonthlyChart({ rows }: BeneficiaryDemographicMonthlyChartProps) {
  if (rows.length === 0) return null

  const manyMonths = rows.length > 6
  const data = rows.map((r) => ({
    ...r,
    monthShort: format(parse(`${r.monthKey}-01`, "yyyy-MM-dd", new Date()), "LLL", { locale: fr }),
  }))

  return (
    <ChartContainer config={chartConfig} className="min-h-[280px] w-full md:min-h-[320px]">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ left: 4, right: 8, top: 12, bottom: 4 }}
        barGap={2}
        barCategoryGap={manyMonths ? "12%" : "18%"}
      >
        <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
        <XAxis
          dataKey="monthShort"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval={0}
          angle={manyMonths ? -32 : 0}
          textAnchor={manyMonths ? "end" : "middle"}
          height={manyMonths ? 52 : 36}
          className="text-[10px] sm:text-xs"
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={36}
          className="text-xs"
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_value, payload) => {
                const row = payload?.[0]?.payload as BeneficiaryDemographicByMonthRow | undefined
                return row?.monthLabel ?? ""
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent className="flex-wrap gap-x-4 gap-y-2 pt-4" />} />
        <Bar
          dataKey="minor"
          fill="var(--color-minor)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="adultAccompanied"
          fill="var(--color-adultAccompanied)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="unknownAge"
          fill="var(--color-unknownAge)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  )
}
