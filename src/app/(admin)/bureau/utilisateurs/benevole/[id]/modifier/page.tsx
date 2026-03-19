import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { BenevoleEditForm } from "../../../_components/benevole-edit-form"

export const metadata: Metadata = { title: "Modifier le bénévole" }

export default async function ModifierBenevolePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const person = await prisma.person.findUnique({
    where: { id },
    include: { address: true },
  })

  if (!person) notFound()

  return (
    <BureauDataPage
      title="Modifier le bénévole"
      description={`Modifier les informations de ${person.firstName} ${person.lastName}`}
    >
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <BenevoleEditForm
            person={{
              id: person.id,
              firstName: person.firstName,
              lastName: person.lastName,
              email: person.email,
              phone: person.phone,
              image: person.image,
              showOnSite: person.showOnSite,
              address: person.address
                ? {
                    address: person.address.address,
                    zipCode: person.address.zipCode,
                    city: person.address.city,
                    country: person.address.country,
                  }
                : null,
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
