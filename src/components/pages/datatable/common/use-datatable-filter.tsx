import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { axGetDataTableList } from "@services/datatable.service";
import { isBrowser } from "@static/constants";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

import { DEFAULT_PARAMS } from "./use-datatableObservation-filter";

const deDupeList = (existingList, newList) => {
  const existingIDs = existingList.map(({ id }) => id);
  return newList.filter(({ id }) => !existingIDs.includes(id));
};

export interface DataTableData {
  l: any[];
  n: number;
  hasMore: boolean;
}
export interface showPageFilters {
  offset?: string;
  limit?: string;
  sortOn?: string;
}

interface DataTableFilterContextProps {
  filter?: showPageFilters;
  setFilter?;
  dataTableData: DataTableData;
  totalCount?;
  species?;
  children?;
  nextPage?;
  resetFilter?;
}

const DataTableFilterContext = createContext<DataTableFilterContextProps>(
  {} as DataTableFilterContextProps
);

export const DataTableFilterContextProvider = (props: DataTableFilterContextProps) => {
  const [filter, setFilter] = useImmer<{ f: any }>({
    f: props.filter ? DEFAULT_PARAMS : props.filter
  });
  const [specieList] = useState(props.species);

  const [dataTableData, setDataTableData] = useImmer<any>(props.dataTableData);

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
        setDataTableData((_draft) => {
          _draft.l = [];
        });
      }

      const { data } = await axGetDataTableList(filter.f);
      setDataTableData((_draft) => {
        if (data?.list?.length) {
          _draft.l.push(...deDupeList(_draft.l, data.list));
          _draft.hasMore = data?.count > Number(filter.f.offset);
        } else {
          _draft.hasMore = false;
        }
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
    <DataTableFilterContext.Provider
      value={{
        filter: filter.f,
        dataTableData,
        species: specieList,
        setFilter,
        nextPage,
        resetFilter
      }}
    >
      {props.children}
    </DataTableFilterContext.Provider>
  );
};

export default function useDataTableList() {
  return useContext(DataTableFilterContext);
}
