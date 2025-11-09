import { notFound } from "next/navigation";
import { getPoleBySlug, getAllPoleSlugs } from "@/data/poles";
import PolePage from "@/components/poles/PolePage";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPoleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default function PoleDetailPage({ params }: PageProps) {
  const pole = getPoleBySlug(params.slug);

  if (!pole) {
    notFound();
  }

  return <PolePage pole={pole} />;
}

