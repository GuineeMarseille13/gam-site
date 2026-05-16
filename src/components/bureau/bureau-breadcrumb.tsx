"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { InvoiceBureauSection } from "@/app/(admin)/bureau/factures/_schemas/invoice.schema"

const segmentLabels: Record<string, string> = {
  bureau: "Bureau",
  administration: "Administration",
  adhesions: "Adhésions",
  dons: "Dons",
  commandes: "Commandes",
  evenements: "Événements",
  poles: "Pôles",
  "demarche-administrative": "Accompagnement administratif",
  evenementiel: "Événementiel",
  "mise-en-relation": "Hébergement et Mise en relation",
  titre: "À propos",
  "nos-services": "Nos services",
  "nos-realisations": "Nos réalisations",
  equipe: "Équipe",
  benevoles: "Bénévoles",
  adherents: "Adhérents",
  partenaires: "Partenaires",
  produits: "Produits",
  statistiques: "Statistiques",
  medias: "Médias",
  parametres: "Paramètres",
  aide: "Aide",
  factures: "Facture",
  profil: "Profil",
  "demande-beneficiaire": "Demande bénéficiaire",
  configuration: "Paramètres demande",
  "nouveau-compte": "Nouvel accès",
  acces: "Accès",
  nouveau: "Nouveau",
  modifier: "Modifier",
}

const INVOICE_SECTIONS: readonly InvoiceBureauSection[] = ["dons", "adhesions", "commandes"]

function isInvoiceSection(value: string | null): value is InvoiceBureauSection {
  return value !== null && (INVOICE_SECTIONS as readonly string[]).includes(value)
}

/**
 * Fil d’Ariane par défaut (chemins bureau hors facture contextualisée).
 */
function BureauBreadcrumbFallback() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const isFacturePage = /^\/bureau\/factures\/[^/]+$/.test(pathname)

  if (isFacturePage) {
    return (
      <BreadcrumbList className="flex-nowrap gap-1.5 text-xs sm:gap-2.5 sm:text-sm">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink
            asChild
            className="whitespace-nowrap text-muted-foreground hover:text-foreground"
          >
            <Link href="/bureau">{segmentLabels.bureau}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="shrink-0 [&>svg]:size-3 sm:[&>svg]:size-3.5" />
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbPage className="font-medium whitespace-nowrap text-muted-foreground">
            …
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    )
  }

  return (
    <BreadcrumbList className="flex-nowrap gap-1.5 text-xs sm:gap-2.5 sm:text-sm">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const href = "/" + segments.slice(0, index + 1).join("/")
        const isFacturePaymentSegment =
          segments[0] === "bureau" &&
          segments[1] === "factures" &&
          isLast &&
          segment.length >= 20
        const label =
          segmentLabels[segment] ?? (isFacturePaymentSegment ? "Document" : segment)

        return (
          <React.Fragment key={href}>
            <BreadcrumbItem className="shrink-0">
              {isLast ? (
                <BreadcrumbPage className="font-medium whitespace-nowrap">{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="whitespace-nowrap text-muted-foreground hover:text-foreground"
                >
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isLast && (
              <BreadcrumbSeparator className="shrink-0 [&>svg]:size-3 sm:[&>svg]:size-3.5" />
            )}
          </React.Fragment>
        )
      })}
    </BreadcrumbList>
  )
}

function BureauBreadcrumbInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const segments = pathname.split("/").filter(Boolean)

  const isFacturePage = /^\/bureau\/factures\/[^/]+$/.test(pathname)
  const section = searchParams.get("section")

  if (isFacturePage && isInvoiceSection(section)) {
    const sectionLabel = segmentLabels[section]

    return (
      <BreadcrumbList className="flex-nowrap gap-1.5 text-xs sm:gap-2.5 sm:text-sm">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink
            asChild
            className="whitespace-nowrap text-muted-foreground hover:text-foreground"
          >
            <Link href="/bureau">{segmentLabels.bureau}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="shrink-0 [&>svg]:size-3 sm:[&>svg]:size-3.5" />
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink
            asChild
            className="whitespace-nowrap text-muted-foreground hover:text-foreground"
          >
            <Link href={`/bureau/${section}`}>{sectionLabel}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="shrink-0 [&>svg]:size-3 sm:[&>svg]:size-3.5" />
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbPage className="font-medium whitespace-nowrap">Facture</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    )
  }

  return (
    <BreadcrumbList className="flex-nowrap gap-1.5 text-xs sm:gap-2.5 sm:text-sm">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const href = "/" + segments.slice(0, index + 1).join("/")
        const isFacturePaymentSegment =
          segments[0] === "bureau" &&
          segments[1] === "factures" &&
          isLast &&
          segment.length >= 20
        const label =
          segmentLabels[segment] ?? (isFacturePaymentSegment ? "Document" : segment)

        return (
          <React.Fragment key={href}>
            <BreadcrumbItem className="shrink-0">
              {isLast ? (
                <BreadcrumbPage className="font-medium whitespace-nowrap">{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="whitespace-nowrap text-muted-foreground hover:text-foreground"
                >
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isLast && (
              <BreadcrumbSeparator className="shrink-0 [&>svg]:size-3 sm:[&>svg]:size-3.5" />
            )}
          </React.Fragment>
        )
      })}
    </BreadcrumbList>
  )
}

/**
 * Fil d’Ariane bureau : à l’écoute de `?section=` sur `/bureau/factures/[id]` pour Bureau › Liste › Facture.
 */
export function BureauBreadcrumb() {
  return (
    <Breadcrumb className="w-max max-w-none">
      <Suspense fallback={<BureauBreadcrumbFallback />}>
        <BureauBreadcrumbInner />
      </Suspense>
    </Breadcrumb>
  )
}
