import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";
import spriteStyle from "./sprite.module.css";
import { ChristmasTreeSelectorProvider } from "./ChristmasTreeSelectorContext";
import ChristmasTreeDisplay from "./ChristmasTreeDisplay";
import ChristmasTreePlacer from "./ChristmasTreePlacer";
import ChristmasTreeButtonGrid from "./ChristmasTreeButtonGrid";
import ChristmasTreeInfo from "./ChristmasTreeInfo";

export default async function ChristmasTreeContent() {
  const treeContent = await getTreeContentFromServer();

  return (
    <ChristmasTreeSelectorProvider initialTree={treeContent}>
      <ChristmasTreePlacer />
      <div className="w-full md:w-min md:max-w-full h-full flex flex-col md:flex-row gap-1 md:gap-0 bg-widget-50 md:rounded-[2rem] md:shadow-xl backdrop-blur-reading pb-8 md:p-0">
        <div
          className={`w-full h-auto md:w-auto md:h-full grid flex-grow items-center justify-center pl-6 pr-6 md:pr-4 pt-6 pb-0 md:pb-6 ${spriteStyle.treeContainer} shrink-0 relative`}
        >
          <div
            className={`h-full ${spriteStyle.treeHeightLimit} ${spriteStyle.treeAspect} object-contain relative`}
          >
            <ChristmasTreeDisplay />
          </div>
          <div className="absolute top-4 left-4">
            <ChristmasTreeInfo />
          </div>
        </div>
        <ChristmasTreeButtonGrid />
      </div>
    </ChristmasTreeSelectorProvider>
  );
}

export const revalidate = 0;
