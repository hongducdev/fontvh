import Link from "next/link";
import { notFound } from "next/navigation";
import { families } from "@/lib/catalog";
import { licenseInfo } from "@/lib/licenses";

export function generateStaticParams() {
  return Array.from(new Set(families.map((family) => family.license.id))).map(
    (id) => ({ id })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const info = licenseInfo(id);
  return { title: info?.name ?? "Giấy phép" };
}

export default async function LicensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const info = licenseInfo(id);
  if (!info) notFound();

  const list = families.filter((family) => family.license.id === id);

  return (
    <div className="pb-16">
      <div className="shell">
        <div className="flex items-center gap-3 border-b border-line py-4 text-[14px] leading-[20px]">
          <Link href="/licenses" className="text-muted hover:text-ink">
            Giấy phép
          </Link>
          <span className="text-faint">/</span>
          <span>{info.name}</span>
        </div>

        <div className="border-b border-line py-10 md:py-14">
          <h1 className="max-w-4xl text-[clamp(36px,6vw,88px)] leading-[0.98] tracking-[-0.03em]">
            {info.name}
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-[24px] text-muted">
            {info.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 border-b border-line md:grid-cols-8">
          <section className="border-b border-line py-8 md:col-span-4 md:border-b-0 md:border-r md:pr-8">
            <h2 className="micro">Được phép</h2>
            <ul className="mt-4 text-[14px] leading-[22px]">
              {info.permissions.map((item) => (
                <li key={item} className="border-b border-line py-3 last:border-b-0">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="py-8 md:col-span-4 md:pl-8">
            <h2 className="micro">Điều kiện</h2>
            <ul className="mt-4 text-[14px] leading-[22px]">
              {info.conditions.map((item) => (
                <li key={item} className="border-b border-line py-3 last:border-b-0">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {info.url && (
          <p className="border-b border-line py-5 text-[14px] leading-[20px]">
            <span className="text-muted">Văn bản gốc: </span>
            <a
              href={info.url}
              target="_blank"
              rel="noreferrer"
              className="link-underline"
            >
              {info.url.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}

        <section className="py-8">
          <h2 className="micro">Họ chữ dùng giấy phép này</h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {list.map((family) => (
              <li key={family.slug}>
                <Link
                  href={`/fonts/${family.slug}`}
                  className="link-underline text-[16px] leading-[24px]"
                  style={{ fontFamily: `'${family.slug}', serif` }}
                >
                  {family.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
