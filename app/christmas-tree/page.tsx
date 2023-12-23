import { Metadata } from "next";
import boxStyle from "./box.module.css";
import ChristmasTreeDisplay from "./ChristmasTreeDisplay";
import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";
import { ChristmasTreeSelectorProvider } from "./ChristmasTreeSelectorContext";
import ChristmasTreePlacer from "./ChristmasTreePlacer";
import ChristmasTreeButtonGrid from "./ChristmasTreeButtonGrid";

export const metadata: Metadata = {
  title: "🎄 Christmas Tree - Zimo Web",
  description: "Decorate the Christmas Tree!",
};

export default async function ChristmasTreePage() {
  const treeContent = await getTreeContentFromServer();

  return (
    <div className="flex justify-center items-center">
      <article
        className={`relative mt-20 mb-20 bg-widget-100 px-6 md:px-10 pb-10 pt-8 rounded-xl border border-saturated border-opacity-75 ${boxStyle.sizing}`}
      >
        <h1 className="font-fancy text-3xl md:text-4xl w-full text-center mb-4 md:mb-6">
          Decorate My Tree!
        </h1>
        <ChristmasTreeSelectorProvider initialTree={treeContent}>
          <ChristmasTreeDisplay />
          <ChristmasTreePlacer />
          <p className="mt-8 mb-5 font-fancy text-lg md:text-xl">
            Drag onto the Tree and Drop!
          </p>
          <div>
            <ChristmasTreeButtonGrid />
          </div>
        </ChristmasTreeSelectorProvider>
      </article>
    </div>
  );
}

export const revalidate = 24;
