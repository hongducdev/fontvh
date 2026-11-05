import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell">
      <div className="flex min-h-[60vh] flex-col justify-center border-b border-line py-16">
        <p className="micro">404</p>
        <h1 className="mt-6 text-[clamp(48px,10vw,140px)] leading-[0.95] tracking-[-0.03em]">
          Không tìm thấy trang này.
        </h1>
        <p className="mt-6 max-w-xl text-[16px] leading-[24px] text-muted">
          Đường dẫn có thể đã đổi hoặc họ chữ chưa được thêm vào thư viện.
        </p>
        <Link href="/fonts" className="btn-solid mt-8 self-start">
          Xem bộ font
        </Link>
      </div>
    </div>
  );
}
