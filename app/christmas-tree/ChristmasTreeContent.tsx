import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";
import spriteStyle from "./sprite.module.css";
import { ChristmasTreeSelectorProvider } from "./ChristmasTreeSelectorContext";
import ChristmasTreeDisplay from "./ChristmasTreeDisplay";
import ChristmasTreePlacer from "./ChristmasTreePlacer";
import ChristmasTreeButtonGrid from "./ChristmasTreeButtonGrid";

export default async function ChristmasTreeContent() {
  const treeContent = await getTreeContentFromServer();

  return (
    <ChristmasTreeSelectorProvider initialTree={treeContent}>
      <ChristmasTreePlacer />
      <div
        className={`w-full md:w-min md:max-w-full h-full flex flex-col md:flex-row gap-4 bg-widget-50 md:rounded-3xl md:shadow-xl backdrop-blur-2xl py-4`}
      >
        <div
          className={`w-full h-auto md:w-auto md:h-full grid flex-grow items-center justify-center px-6 pt-6 pb-0 md:pb-6 ${spriteStyle.treeContainer} shrink-0`}
        >
          <div
            className={`h-full ${spriteStyle.treeHeightLimit} ${spriteStyle.treeAspect} object-contain`}
          >
            <ChristmasTreeDisplay />
          </div>
        </div>
        <ChristmasTreeButtonGrid />
      </div>
    </ChristmasTreeSelectorProvider>
  );
}
