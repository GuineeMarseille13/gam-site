"use client"

import { parseISO } from "date-fns"

import type { CampuceFranceSubmissionAdminRow } from "@/app/(admin)/administration/_schemas/campuce-france-submission-admin.schema"

export function rowLabel(row: CampuceFranceSubmissionAdminRow): string {
  return `${row.firstName} ${row.lastName}`.trim()
}

function progressWidthClassName(filesCount: number): string {
  const clamped = Math.max(0, Math.min(3, filesCount))
  if (clamped >= 3) return "campuce-progress-3"
  if (clamped >= 2) return "campuce-progress-2"
  if (clamped >= 1) return "campuce-progress-1"
  return "campuce-progress-0"
}

function progressColorClassName(row: CampuceFranceSubmissionAdminRow): string {
  if (row.isComplete) return "campuce-progress-color-complete"
  if (row.hasHostingAttestation) return "campuce-progress-color-attestation"
  return "campuce-progress-color-default"
}

export function progressBackgroundClassName(
  row: CampuceFranceSubmissionAdminRow,
): string {
  return [
    "campuce-progress-row",
    progressWidthClassName(row.filesIds.length),
    progressColorClassName(row),
  ].join(" ")
}

export function yearFromIso(iso: string): number {
  return parseISO(iso).getFullYear()
}

