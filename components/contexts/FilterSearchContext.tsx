"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const FilterSearchContext = createContext<
  | {
      filterSearchContent: string;
      setFilterSearchContent: React.Dispatch<React.SetStateAction<string>>;
      shouldSearchBarUpdate: boolean;
      setShouldSearchBarUpdate: React.Dispatch<React.SetStateAction<boolean>>;
      updateFilterSearchContent: (value: string) => void;
    }
  | undefined
>(undefined);

export function FilterSearchProvider({ children }: Props) {
  const [filterSearchContent, setFilterSearchContent] = useState<string>("");
  const [shouldSearchBarUpdate, setShouldSearchBarUpdate] =
    useState<boolean>(false);

  const updateFilterSearchContent = (value: string) => {
    setFilterSearchContent(value);
    setShouldSearchBarUpdate(true);
  };

  return (
    <FilterSearchContext.Provider
      value={{
        filterSearchContent,
        setFilterSearchContent,
        shouldSearchBarUpdate,
        setShouldSearchBarUpdate,
        updateFilterSearchContent,
      }}
    >
      {children}
    </FilterSearchContext.Provider>
  );
}

export const useFilterSearch = () => {
  const context = useContext(FilterSearchContext);
  if (context === undefined) {
    throw new Error(
      "useFilterSearch must be used within a FilterSearchProvider"
    );
  }
  return context;
};
