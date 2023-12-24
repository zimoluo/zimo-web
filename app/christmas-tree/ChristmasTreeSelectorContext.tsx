"use client";

import { fetchGetTreeContent } from "@/lib/dataLayer/client/specialServiceClient";
import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  initialTree?: TreeContent[];
}

const ChristmasTreeSelectorContext = createContext<
  | {
      selectedData: TreeSelection;
      setSelectedData: React.Dispatch<React.SetStateAction<TreeSelection>>;
      isPlacerProperlyMounted: boolean;
      setIsPlacerProperlyMounted: React.Dispatch<React.SetStateAction<boolean>>;
      deselectData: () => void;
      selectSprite: (sprite: string) => void;
      treeData: TreeContent[];
      setTreeData: React.Dispatch<React.SetStateAction<TreeContent[]>>;
      fetchAndSetTreeData: () => Promise<void>;
    }
  | undefined
>(undefined);

export function ChristmasTreeSelectorProvider({
  children,
  initialTree = [],
}: Props) {
  const [selectedData, setSelectedData] = useState<TreeSelection>({
    hasSelected: false,
    sprite: "cane",
  });

  const [treeData, setTreeData] = useState<TreeContent[]>(initialTree);
  const [isPlacerProperlyMounted, setIsPlacerProperlyMounted] =
    useState<boolean>(false);

  const deselectData = () => {
    setSelectedData({ ...selectedData, hasSelected: false });
    setIsPlacerProperlyMounted(false);
  };

  const selectSprite = (sprite: string) => {
    setSelectedData({ sprite, hasSelected: true });
  };

  const fetchAndSetTreeData = async () => {
    const fetchedTreeContent = await fetchGetTreeContent();
    if (fetchedTreeContent && fetchedTreeContent.length > 0) {
      setTreeData(fetchedTreeContent);
    } else {
      setTreeData([]);
    }
  };

  return (
    <ChristmasTreeSelectorContext.Provider
      value={{
        selectedData,
        setSelectedData,
        deselectData,
        selectSprite,
        treeData,
        setTreeData,
        fetchAndSetTreeData,
        isPlacerProperlyMounted,
        setIsPlacerProperlyMounted,
      }}
    >
      {children}
    </ChristmasTreeSelectorContext.Provider>
  );
}

export const useChristmasTreeSelector = () => {
  const context = useContext(ChristmasTreeSelectorContext);
  if (context === undefined) {
    throw new Error(
      "useChristmasTreeSelector must be used within a ChristmasTreeSelectorProvider"
    );
  }
  return context;
};
