import { notFound } from "next/navigation";
import { getPoleBySlug, getAllPoleSlugs } from "@/data/poles";
import PolePage from "@/components/poles/PolePage";

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
  const pole = getPoleBySlug(slug);

  if (!pole) {
    notFound();
  }

  return <PolePage pole={pole} />;
}

