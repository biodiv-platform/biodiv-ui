import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { isBrowser } from "@static/constants";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

import { axListDwc } from "@/services/files.service";

export const DEFAULT_PARAMS = {
  offset: 0
};

export interface DwcLogsData {
  filePath: string;
  l: any[];
  n: number;
  hasMore: boolean;
}

export interface showPageFilters {
  offset?: any;
  limit?: any;
}

interface DwcLogsDataContextProps {
  filter?: showPageFilters;
  DwcLogData: DwcLogsData;
  addFilter?;
  removeFilter?;
  children?;
  nextPage?;
  setFilter?;
  resetFilter?;
}

const DwcLogsContext = createContext<DwcLogsDataContextProps>({} as DwcLogsDataContextProps);

export const DwcLogsDataProvider = (props: DwcLogsDataContextProps) => {
  const [filter, setFilter] = useImmer<showPageFilters>(props.filter || DEFAULT_PARAMS);

  const [DwcLogData, setDwcLogData] = useImmer<DwcLogsData>(props.DwcLogData);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter })}`);
    }
  }, [filter]);

  const fetchListData = async () => {
    try {
      NProgress.start();

      const { data } = await axListDwc(filter);

      setDwcLogData((draft) => {
        draft.l = data.files || [];
        draft.n = data.total;
        draft.filePath = data.filePath;
        draft.hasMore = data.total > (Number(filter.offset) || 0) + (Number(filter.limit) || 15);
      });

      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  useDidUpdateEffect(() => {
    fetchListData();
  }, [filter]);

  const nextPage = (max = 15) => {
    setFilter((draft) => {
      draft.offset = (Number(draft.offset) || 0) + max;
      draft.limit = max;
    });
  };

  const addFilter = (key, value) => {
    setFilter((draft) => {
      draft.offset = 0;
      draft[key] = value;
    });
  };

  const removeFilter = (key) => {
    setFilter((draft) => {
      delete draft[key];
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
        addFilter,
        setFilter,
        removeFilter,
        nextPage,
        resetFilter
      }}
    >
      {props.children}
    </DwcLogsContext.Provider>
  );
};

export default function useDwcLogsList() {
  return useContext(DwcLogsContext);
}
