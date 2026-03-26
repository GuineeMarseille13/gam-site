import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { administrationCardClassName } from "@/config/administration-dashboard-theme"
import { updateBenevole } from "@/app/(admin)/bureau/benevoles/_actions/actions"
import { BenevoleForm } from "@/app/(admin)/bureau/benevoles/_components/benevole-form"

export default async function AdministrationModifierBenevolePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const volunteer = await prisma.volunteer.findUnique({ where: { id } })
  if (!volunteer) notFound()

  const person = await prisma.person.findUnique({
    where: { id: volunteer.personId },
    include: { address: true },
  })
  if (!person) notFound()

  const action = updateBenevole.bind(null, volunteer.id)

  return (
    <BureauDataPage
      title="Modifier le bénévole"
      description={`${person.firstName} ${person.lastName}`}
      dashboard="administration"
    >
      <Card className={administrationCardClassName}>
        <CardContent className="pt-6">
          <BenevoleForm
            action={action}
            submitLabel="Enregistrer les modifications"
            dashboardBase="/administration"
            defaultValues={{
              firstName: person.firstName,
              lastName: person.lastName,
              email: person.email,
              phone: person.phone,
              showOnSite: person.showOnSite,
              imageUrl: person.image,
              address: person.address?.address,
              zipCode: person.address?.zipCode,
              city: person.address?.city,
              country: person.address?.country,
            }}
          />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
