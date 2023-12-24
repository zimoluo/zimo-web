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
      className={`relative mt-20 mb-20 bg-widget-100 px-8 md:px-10 pb-10 pt-8 rounded-xl border border-saturated border-opacity-75 ${boxStyle.sizing}`}
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
