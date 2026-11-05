import Link from "next/link";
import { families, licenseTypes } from "@/lib/catalog";
import { licenseInfo } from "@/lib/licenses";

export const metadata = {
  title: "Giấy phép",
  description: "Điều khoản sử dụng font trong thư viện fontvh.",
};

export default function LicensesPage() {
  return (
    <div className="shell pb-16">
      <div className="border-b border-line py-6 md:py-10">
        <p className="micro">Pháp lý</p>
        <h1 className="mt-4 text-[clamp(44px,8vw,120px)] leading-[0.95] tracking-[-0.03em]">
          Giấy phép
        </h1>
      </div>

      <p className="max-w-2xl border-b border-line py-6 text-[16px] leading-[24px] text-muted">
        Mỗi họ chữ có giấy phép riêng, ghi rõ trên trang chi tiết và kèm trong gói
        tải về. Trước khi dùng cho thương mại, đọc điều khoản gốc trong file
        license.
      </p>

      <div>
        {licenseTypes.map((type) => {
          const info = licenseInfo(type.id);
          const count = families.filter(
            (family) => family.license.id === type.id
          ).length;

          return (
            <Link
              key={type.id}
              href={`/licenses/${type.id}`}
              className="group grid grid-cols-1 gap-3 border-b border-line py-6 md:grid-cols-8 md:items-baseline"
            >
              <h2 className="text-[24px] leading-[29px] tracking-[-0.01em] transition-colors group-hover:text-muted md:col-span-3">
                {info?.name ?? type.name}
              </h2>
              <p className="text-[14px] leading-[22px] text-muted md:col-span-4">
                {info?.summary}
              </p>
              <span className="micro md:col-span-1 md:text-right">
                {count} họ chữ →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
