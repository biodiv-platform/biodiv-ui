import { axGetSpeciesList } from "@services/species.service";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

interface CounterContextProps {
  speciesData;
  nextPage;
  isLoading;
}

interface SpeciesListProviderProps {
  children;
}

const CounterContext = createContext<CounterContextProps>({} as CounterContextProps);

const PAGE_SIZE = 10;

export const SpeciesListProvider = ({ children }: SpeciesListProviderProps) => {
  const [speciesData, setSpeciesData] = useImmer({
    total: 0,
    l: [] as any[],
    offset: 0,
    hasMore: false
  });

  const [isLoading, setIsLoading] = useState<boolean>();

  const nextPage = async () => {
    setIsLoading(true);
    const { success, speciesTiles, totalCount } = await axGetSpeciesList({
      offset: speciesData.offset
    });
    if (success) {
      setSpeciesData((_draft) => {
        _draft.total = totalCount;
        _draft.l.push(...speciesTiles);
        _draft.hasMore = speciesTiles.length === PAGE_SIZE;
        _draft.offset = _draft.offset + PAGE_SIZE;
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    nextPage();
  }, []);

  return (
    <CounterContext.Provider
      value={{
        speciesData,
        nextPage,
        isLoading
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};

export default function useSpeciesList() {
  return useContext(CounterContext);
}
