import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdherentDetailForDashboard } from "@/helpers/adherent-detail";
import { sessionCanAccessBureauAdminAdherents } from "@/helpers/api-dashboard-auth";
import { auth } from "@/lib/auth";

const personIdParamsSchema = z.object({
  personId: z.string().min(1),
});

/**
 * Détail d’un adhérent : cotisations et paiements associés (session + rôle bureau requis).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ personId: string }> },
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !sessionCanAccessBureauAdminAdherents(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const resolved = await params;
  const parsed = personIdParamsSchema.safeParse(resolved);

  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètre invalide." }, { status: 400 });
  }

  const detail = await getAdherentDetailForDashboard(parsed.data.personId);

  if (!detail) {
    return NextResponse.json({ error: "Adhérent introuvable." }, { status: 404 });
  }

  return NextResponse.json(detail);
}
