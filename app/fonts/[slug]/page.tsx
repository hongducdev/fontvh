import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFamily, families } from "@/lib/catalog";
import { FontDetailTabs } from "@/components/font-detail-tabs";

export function generateStaticParams() {
  return families.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = getFamily(slug);
  if (!family) return { title: "Không tìm thấy font" };

  return {
    title: family.name,
    description: family.description,
    openGraph: {
      title: `${family.name} · fontvh`,
      description: family.description,
    },
  };
}

export default async function FontDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const family = getFamily(slug);
  if (!family) notFound();

  return (
    <div className="pb-24">
      <FontDetailTabs family={family} allFamilies={families} />
    </div>
  );
}
