import { Metadata } from "next";
import boxStyle from "./box.module.css";
import ChristmasTreeDisplay from "./ChristmasTreeDisplay";
import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";

export const metadata: Metadata = {
  title: "🎄 Christmas Tree - Zimo Web",
  description: "Decorate the Christmas Tree!",
};

export default async function ChristmasTreePage() {
  const treeContent = await getTreeContentFromServer();

  return (
    <div className="flex justify-center items-center">
      <article
        className={`relative mt-20 mb-20 bg-widget-100 px-10 py-10 rounded-xl border border-saturated border-opacity-75 ${boxStyle.sizing}`}
      >
        <ChristmasTreeDisplay initialTree={treeContent} />
      </article>
    </div>
  );
}

export const revalidate = 24;
