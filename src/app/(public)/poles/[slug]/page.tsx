import { notFound } from "next/navigation";

import PolePage from "@/components/poles/PolePage";
import { getPoleBySlug, getAllPoleSlugs } from "@/data/poles";
import { ADMINISTRATIVE_POLE_SLUG } from "@/helpers/administrative-permanence/constants";
import { mergeAdministrativePoleWithDb } from "@/helpers/administrative-permanence/merge-administrative-pole";
import {
  getAdministrativePermanenceSettings,
  getAdministrativePermanenceSlots,
} from "@/helpers/administrative-permanence/queries";

/** Calendrier admin lu en base : pas de cache page statique indéfini. */
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPoleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function PoleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const poleBase = getPoleBySlug(slug);

  if (!poleBase) {
    notFound();
  }

  if (slug === ADMINISTRATIVE_POLE_SLUG) {
    const [slots, settings] = await Promise.all([
      getAdministrativePermanenceSlots(),
      getAdministrativePermanenceSettings(),
    ]);
    const slotDisplays = slots.map((s) => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    }));
    const pole = mergeAdministrativePoleWithDb(
      poleBase,
      slotDisplays,
      settings.horairesCardText
    );
    return <PolePage pole={pole} />;
  }

  return <PolePage pole={poleBase} />;
}

