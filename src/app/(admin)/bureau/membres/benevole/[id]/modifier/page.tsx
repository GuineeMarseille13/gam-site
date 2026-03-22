import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { BenevoleForm } from "../../../_components/benevole-form"

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
      description={`${person.firstName} ${person.lastName}`}
    >
      <Card>
        <CardContent className="pt-6">
          <BenevoleForm
            mode="edit"
            defaultValues={{
              id:         person.id,
              firstName:  person.firstName,
              lastName:   person.lastName,
              phone:      person.phone,
              email:      person.email,
              imageUrl:   person.image,
              showOnSite: person.showOnSite,
              address:    person.address
                ? {
                    address: person.address.address,
                    zipCode: person.address.zipCode,
                    city:    person.address.city,
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
