import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";
import { ChristmasTreeSelectorProvider } from "./ChristmasTreeSelectorContext";
import ChristmasTreeDisplay from "./ChristmasTreeDisplay";
import boxStyle from "./box.module.css";
import ChristmasTreePlacer from "./ChristmasTreePlacer";
import ChristmasTreeButtonGrid from "./ChristmasTreeButtonGrid";

export default async function ChristmasTreeContainer() {
  const treeContent = await getTreeContentFromServer();

  return (
    <article
      className={`relative mt-16 md:mt-20 md:mb-20 bg-widget-80 shadow-xl px-12 md:px-10 pb-16 md:pb-10 pt-12 md:pt-8 md:rounded-3xl ${boxStyle.sizing}`}
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
  );
}
