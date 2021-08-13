import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { axGetDownloadLogsList } from "@services/user.service";
import { isBrowser } from "@static/constants";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

const deDupeDownloadLog = (current, latest) => {
  const existingIDs = current.map(({ id }) => id);
  return latest.filter(({ id }) => !existingIDs.includes(id));
};

export const DEFAULT_PARAMS = {
  offset: 0
};

export interface DownloadLogsData {
  l: any[];
  n: number;
  hasMore: boolean;
}

export interface showPageFilters {
  offset?: string;
  limit?: string;
}

interface DownloadLogsDataContextProps {
  filter?: showPageFilters;
  downloadLogData: DownloadLogsData;
  totalCount?;
  children?;
  nextPage?;
  resetFilter?;
}

const DownloadLogsContext = createContext<DownloadLogsDataContextProps>(
  {} as DownloadLogsDataContextProps
);

export const DownloadLogsDataProvider = (props: DownloadLogsDataContextProps) => {
  const [filter, setFilter] = useImmer<{ f: any }>({
    f: props.filter ? DEFAULT_PARAMS : props.filter
  });

  const [downloadLogData, setDownloadLogData] = useImmer<any>(props.downloadLogData);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f })}`);
    }
  }, [filter]);

  const fetchListData = async () => {
    try {
      NProgress.start();

      // Reset list data if params are changed
      if (filter.f?.offset === 0) {
        setDownloadLogData((_draft) => {
          _draft.l = [];
        });
      }

      const { data } = await axGetDownloadLogsList(filter.f);
      setDownloadLogData((_draft) => {
        if (data?.downloadLogList?.length) {
          _draft.l.push(...deDupeDownloadLog(_draft.l, data.downloadLogList));
          _draft.hasMore = data?.downloadLogList?.length === Number(filter.f.limit);
        }
        _draft.n = data.count;
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

  const nextPage = (max = LIST_PAGINATION_LIMIT) => {
    setFilter((_draft) => {
      _draft.f.offset = Number(_draft.f.offset) + max;
    });
  };

  const resetFilter = () => {
    setFilter((_draft) => {
      _draft.f = { offset: 0 };
    });
  };
  return (
    <DownloadLogsContext.Provider
      value={{
        filter: filter.f,
        downloadLogData,
        nextPage,
        resetFilter
      }}
    >
      {props.children}
    </DownloadLogsContext.Provider>
  );
};
export default function useDownloadLogsList() {
  return useContext(DownloadLogsContext);
}
