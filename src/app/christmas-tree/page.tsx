import { Metadata } from "next";
import { TreeBoard } from "@/src/features/christmas-tree";

export const metadata: Metadata = {
  title: "🎄 Christmas Tree - Zimo Web",
  description: "Decorate the Christmas Tree!",
  keywords:
    "Zimo Web, Zimo Luo, Christmas Tree, Personal Website, Decorate Christmas Tree",
  openGraph: {
    type: "article",
    title: "Christmas Tree - Zimo Web",
    url: `/christmas-tree`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Tree - Zimo Web",
  },
};

export default async function ChristmasTreePage() {
  return (
    <div className="flex justify-center items-center">
      <TreeBoard />
    </div>
  );
}

export const revalidate = 0;
