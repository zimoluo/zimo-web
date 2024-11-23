import { Metadata } from "next";
import ChristmasTreeContainer from "./ChristmasTreeContainer";

export const metadata: Metadata = {
  title: "🎄 Christmas Tree - Zimo Web",
  description: "Decorate the Christmas Tree!",
  keywords:
    "Zimo Web, Zimo Luo, Christmas Tree, Personal Website, Decorate Christmas Tree",
};

export default async function ChristmasTreePage() {
  return (
    <div className="flex justify-center items-center">
      <ChristmasTreeContainer />
    </div>
  );
}

export const revalidate = 24;
