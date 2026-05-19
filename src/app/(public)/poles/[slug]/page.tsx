import { notFound } from "next/navigation";

import PolePage from "@/components/poles/PolePage";
import { getPoleBySlug, getAllPoleSlugs } from "@/data/poles";
import { ADMINISTRATIVE_POLE_SLUG } from "@/helpers/administrative-permanence/constants";
import { mergeAdministrativePoleWithDb } from "@/helpers/administrative-permanence/merge-administrative-pole";
import {
  getAdministrativePermanenceSettings,
  getAdministrativePermanenceSlots,
} from "@/helpers/administrative-permanence/queries";
import { isBureauPoleContentSlug } from "@/config/bureau-poles-content";
import { getDetailsPoleBureauContentByPublicSlug } from "@/helpers/details-pole-bureau/queries";
import { getActivePoleStatsByPublicSlug } from "@/helpers/details-pole-stats/queries";
import { getActivePoleServicesByPublicSlug } from "@/helpers/details-pole-services/queries";
import { getActivePoleAchievementsByPublicSlug } from "@/helpers/details-pole-achievements/queries";

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

  let pole = poleBase;

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
    pole = mergeAdministrativePoleWithDb(
      poleBase,
      slotDisplays,
      settings.horairesCardText,
      settings.showCampusFranceCard,
    );
  }

  if (isBureauPoleContentSlug(slug)) {
    const [details, dbStats, dbServices, dbAchievements] = await Promise.all([
      getDetailsPoleBureauContentByPublicSlug(slug),
      getActivePoleStatsByPublicSlug(slug),
      getActivePoleServicesByPublicSlug(slug),
      getActivePoleAchievementsByPublicSlug(slug),
    ]);
    if (details) {
      pole = {
        ...pole,
        ...(details.aboutSectionText
          ? { description: details.aboutSectionText }
          : {}),
        detailsNarratives: {
          services: null,
          statistics: null,
          achievements: details.achievementsSectionText,
        },
        ...(dbServices && dbServices.length > 0 ? { services: dbServices } : {}),
        ...(dbStats && dbStats.length > 0
          ? {
              statistics: {
                title: pole.statistics?.title,
                items: dbStats,
              },
            }
          : {}),
        ...(dbAchievements && dbAchievements.length > 0
          ? { eventImages: dbAchievements }
          : {}),
      };
    }
  }

  return <PolePage pole={pole} />;
}

