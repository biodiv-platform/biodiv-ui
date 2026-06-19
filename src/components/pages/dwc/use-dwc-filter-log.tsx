import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { isBrowser } from "@static/constants";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

import { axListDwc } from "@/services/files.service";

export const DEFAULT_PARAMS = {
  offset: 0,
  limit: 15
};

const DEFAULT_DATA = {
  filePath: "",
  l: [],
  n: 0,
  hasMore: false
};

export interface DwcLogsData {
  filePath: string;
  l: any[];
  n: number;
  hasMore: boolean;
}

export interface ShowPageFilters {
  offset?: number;
  limit?: number;
  deleted?: string;
}

interface DwcLogsDataContextProps {
  filter: ShowPageFilters;
  DwcLogData: DwcLogsData;
  loading: boolean;
  addFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  nextPage: (limit?: number) => void;
  setFilter: any;
  resetFilter: () => void;
}

const DwcLogsContext = createContext<DwcLogsDataContextProps>({} as DwcLogsDataContextProps);

export const DwcLogsDataProvider = ({
  children,
  filter: initialFilter
}: {
  children: React.ReactNode;
  filter?: ShowPageFilters;
}) => {
  const [filter, setFilter] = useImmer<ShowPageFilters>(initialFilter || DEFAULT_PARAMS);

  const [DwcLogData, setDwcLogData] = useImmer<DwcLogsData>(DEFAULT_DATA);

  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------
 FETCH FUNCTION
------------------------------------------------ */

  const fetchListData = async () => {
    try {
      setLoading(true);
      NProgress.start();

      const { success, data } = await axListDwc(filter);

      if (success) {
        setDwcLogData((draft) => {
          draft.l = data?.files || [];
          draft.n = data?.total || 0;
          draft.filePath = data?.filePath || "";
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

  /* ------------------------------------------------
 INITIAL LOAD
------------------------------------------------ */

  useEffect(() => {
    fetchListData();
  }, []);

  /* ------------------------------------------------
 URL SYNC
------------------------------------------------ */

  useEffect(() => {
    if (isBrowser) {
      window.history.replaceState("", "", `?${stringify({ ...filter })}`);
    }
  }, [filter]);

  /* ------------------------------------------------
 FILTER CHANGE FETCH
------------------------------------------------ */

  useDidUpdateEffect(() => {
    fetchListData();
  }, [filter]);

  /* ------------------------------------------------
 ACTIONS
------------------------------------------------ */

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
    <DwcLogsContext.Provider
      value={{
        filter,
        DwcLogData,
        loading,
        addFilter,
        setFilter,
        removeFilter,
        nextPage,
        resetFilter
      }}
    >
      {children}
    </DwcLogsContext.Provider>
  );
};

export default function useDwcLogsList() {
  return useContext(DwcLogsContext);
}
