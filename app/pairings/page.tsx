import { PairingsView } from "@/components/pairings-view";
import { pairings } from "@/lib/pairings";

export const metadata = {
  title: "Cặp font",
  description:
    "Tuyển tập các cặp font chữ tiếng Việt kết hợp hài hòa cho tiêu đề và nội dung bài viết.",
};

export default function PairingsPage() {
  return <PairingsView pairings={pairings} />;
}
