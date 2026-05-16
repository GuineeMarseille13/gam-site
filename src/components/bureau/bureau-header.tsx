"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { BureauBreadcrumb } from "@/components/bureau/bureau-breadcrumb"

export function BureauHeader() {
  return (
    <header className="print:hidden sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-3 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-1 h-4 shrink-0 data-[orientation=vertical]:h-4 sm:mx-2"
        />

        <div className="flex min-h-0 min-w-0 flex-1 touch-pan-x items-center overflow-x-auto overscroll-x-contain py-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
          <BureauBreadcrumb />
        </div>

        <div className="ml-1 flex shrink-0 items-center sm:ml-2 sm:pl-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
