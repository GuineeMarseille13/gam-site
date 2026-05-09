import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import {
  IconIdBadge2,
  IconHeart,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react"
import { BureauRecentPayments } from "@/components/bureau/bureau-recent-payments"
import { formatCurrency } from "@/helpers/format-currency"

export const metadata: Metadata = { title: "Vue d'ensemble" }

async function getStats() {
  const [adhesions, dons, commandes, personnes] = await Promise.all([
    prisma.memberShip.count(),
    prisma.donation.count(),
    prisma.order.count(),
    prisma.person.count(),
  ])
  const [totalDons, totalAdhesions, totalCommandes] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.memberShip.aggregate({ _sum: { amount: true } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ])
  return {
    adhesions,
    dons,
    commandes,
    personnes,
    montantDons: totalDons._sum.amount ?? 0,
    montantAdhesions: totalAdhesions._sum.amount ?? 0,
    montantCommandes: totalCommandes._sum.totalAmount ?? 0,
  }
}

async function getRecentPayments() {
  return prisma.payment.findMany({
    take: 10,
    orderBy: { paymentDate: "desc" },
    include: { person: true },
  })
}

const kpiConfig = [
  {
    key: "adhesions" as const,
    label: "Adhésions",
    icon: IconIdBadge2,
    color: "amber",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-200",
  },
  {
    key: "dons" as const,
    label: "Dons",
    icon: IconHeart,
    color: "rose",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    border: "border-rose-200",
  },
  {
    key: "commandes" as const,
    label: "Commandes",
    icon: IconShoppingCart,
    color: "blue",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-200",
  },
  {
    key: "personnes" as const,
    label: "Personnes",
    icon: IconUsers,
    color: "violet",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    border: "border-violet-200",
  },
]

export default async function BureauOverviewPage() {
  const [stats, recentPayments] = await Promise.all([getStats(), getRecentPayments()])

  const subValues: Record<string, string> = {
    adhesions: formatCurrency(stats.montantAdhesions, { maximumFractionDigits: 0 }) + " collectés",
    dons: formatCurrency(stats.montantDons, { maximumFractionDigits: 0 }) + " collectés",
    commandes: formatCurrency(stats.montantCommandes, { maximumFractionDigits: 0 }) + " de ventes",
    personnes: "dans la base de données",
  }

  const countValues: Record<string, number> = {
    adhesions: stats.adhesions,
    dons: stats.dons,
    commandes: stats.commandes,
    personnes: stats.personnes,
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
        <p className="text-sm text-muted-foreground mt-1">Tableau de bord de l&apos;association</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiConfig.map((kpi) => (
          <div
            key={kpi.key}
            className={`rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md ${kpi.border}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {countValues[kpi.key]}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">{subValues[kpi.key]}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${kpi.iconBg} shrink-0`}>
                <kpi.icon className={`size-5 ${kpi.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paiements récents */}
      <BureauRecentPayments payments={recentPayments} />
    </div>
  )
}
