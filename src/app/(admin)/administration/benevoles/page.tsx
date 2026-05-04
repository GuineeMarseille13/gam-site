import type { Metadata } from "next"
import { getBenevolesForDashboard } from "@/helpers/benevoles"
import { BenevolesListSection } from "@/components/bureau/benevoles-list-section"

export const metadata: Metadata = { title: "Bénévoles" }

export default async function AdministrationBenevolesPage() {
  const benevoles = await getBenevolesForDashboard()
  return <BenevolesListSection benevoles={benevoles} basePath="/administration" />
}
