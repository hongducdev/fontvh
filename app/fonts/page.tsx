import { FontsBrowser } from "@/components/fonts-browser";
import { categories, families } from "@/lib/catalog";

export const metadata = {
  title: "Bộ font",
  description: "Duyệt toàn bộ họ chữ tiếng Việt trong thư viện fontvh với chế độ thử chữ trực tiếp.",
};

type SearchParams = {
  q?: string;
  category?: string;
  vi?: string;
  variable?: string;
};

export default async function FontsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <FontsBrowser
      families={families}
      categories={categories}
      initialCategory={params.category ?? ""}
      initialQuery={params.q ?? ""}
      initialVariable={params.variable === "1"}
      initialVi={params.vi === "1"}
    />
  );
}
