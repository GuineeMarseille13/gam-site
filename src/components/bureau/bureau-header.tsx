"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/theme/theme-toggle"

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
  "mise-en-relation": "Mise en relation",
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
  profil: "Profil",
  "demande-beneficiaire": "Demande bénéficiaire",
  configuration: "Paramètres demande",
  "nouveau-compte": "Nouvel accès",
  acces: "Accès",
  nouveau: "Nouveau",
  modifier: "Modifier",
}

export function BureauHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-3 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-1 h-4 shrink-0 data-[orientation=vertical]:h-4 sm:mx-2"
        />

        <div className="flex min-h-0 min-w-0 flex-1 touch-pan-x items-center overflow-x-auto overscroll-x-contain py-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
          <Breadcrumb className="w-max max-w-none">
            <BreadcrumbList className="flex-nowrap gap-1.5 text-xs sm:gap-2.5 sm:text-sm">
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1
                const href = "/" + segments.slice(0, index + 1).join("/")
                const label = segmentLabels[segment] ?? segment

                return (
                  <React.Fragment key={href}>
                    <BreadcrumbItem className="shrink-0">
                      {isLast ? (
                        <BreadcrumbPage className="font-medium whitespace-nowrap">
                          {label}
                        </BreadcrumbPage>
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
          </Breadcrumb>
        </div>

        <div className="ml-1 flex shrink-0 items-center sm:ml-2 sm:pl-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
