import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { isBrowser } from "@static/constants";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

import { axListObservation } from "@/services/observation.service";

export const DEFAULT_PARAMS = {
  offset: 0,
  limit: 15
};

const DEFAULT_DATA = {
  l: [],
  n: 0,
  hasMore: false
};

export interface ObservationListData {
  l: any[];
  n: number;
  hasMore: boolean;
}

export interface ObservationFilters {
  offset?: number;
  limit?: number;
  authorId?: string;
}

interface ObservationContextProps {
  filter: ObservationFilters;
  observationData: ObservationListData;
  loading: boolean;
  addFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  nextPage: (limit?: number) => void;
  setFilter: any;
  resetFilter: () => void;
}

const ObservationContext = createContext<ObservationContextProps>({} as ObservationContextProps);

export const ObservationListProvider = ({
  children,
  filter: initialFilter
}: {
  children: React.ReactNode;
  filter?: ObservationFilters;
}) => {
  const [filter, setFilter] = useImmer<ObservationFilters>(initialFilter || DEFAULT_PARAMS);

  const [observationData, setObservationData] = useImmer<ObservationListData>(DEFAULT_DATA);

  const [loading, setLoading] = useState(false);

  const fetchListData = async () => {
    try {
      setLoading(true);
      NProgress.start();

      const { success, data } = await axListObservation(filter);

      if (success) {
        setObservationData((draft) => {
          draft.l = data?.data || [];
          draft.n = data?.total || 0;
          draft.hasMore =
            (data?.total || 0) > (Number(filter.offset) || 0) + (Number(filter.limit) || 15);
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => {
    fetchListData();
  }, []);

  useEffect(() => {
    if (isBrowser) {
      window.history.replaceState("", "", `?${stringify({ ...filter })}`);
    }
  }, [filter]);

  useDidUpdateEffect(() => {
    fetchListData();
  }, [filter]);

  const nextPage = (limit = 15) => {
    setFilter((draft) => {
      draft.offset = (Number(draft.offset) || 0) + limit;
      draft.limit = limit;
    });
  };

  const addFilter = (key: string, value: any) => {
    setFilter((draft) => {
      draft.offset = 0;
      draft[key] = value;
    });
  };

  const removeFilter = (key: string) => {
    setFilter((draft) => {
      delete draft[key];
      draft.offset = 0;
    });
  };

  const resetFilter = () => {
    setFilter(() => ({
      offset: 0,
      limit: 15
    }));
  };

  return (
    <ObservationContext.Provider
      value={{
        filter,
        observationData,
        loading,
        addFilter,
        setFilter,
        removeFilter,
        nextPage,
        resetFilter
      }}
    >
      {children}
    </ObservationContext.Provider>
  );
};

export default function useObservationList() {
  return useContext(ObservationContext);
}
