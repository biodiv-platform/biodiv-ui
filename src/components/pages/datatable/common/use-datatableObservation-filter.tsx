import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { Observation } from "@interfaces/observation";
import { axGetObservationListByDatatableId } from "@services/observation.service";
import { isBrowser } from "@static/constants";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

const deDupeObservations = (existingObservations, newObservations) => {
  const existingIDs = existingObservations.map(({ id }) => id);
  return newObservations.filter(({ id }) => !existingIDs.includes(id));
};

export const DEFAULT_PARAMS = {
  offset: 0
};

export interface ObservationData {
  l: Observation[];
  n: number;
  hasMore: boolean;
  datatableId: number;
}

export interface showPageFilters {
  offset?: string;
  limit?: string;
}

interface DataTableObservationContextProps {
  filter?: showPageFilters;
  observationData: ObservationData;
  totalCount?;
  children?;
  nextPage?;
  resetFilter?;
}

const DataTableObservationContext = createContext<DataTableObservationContextProps>(
  {} as DataTableObservationContextProps
);

export const DataTableObservationListProvider = (props: DataTableObservationContextProps) => {
  const [filter, setFilter] = useImmer<{ f: any }>({
    f: props.filter ? DEFAULT_PARAMS : props.filter
  });

  const [datatableId] = useImmer<any>(props.observationData.datatableId);
  const [observationData, setObservationData] = useImmer<any>(props.observationData);

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
        setObservationData((_draft) => {
          _draft.l = [];
        });
      }

      const { data: observationList } = await axGetObservationListByDatatableId(
        datatableId,
        filter.f
      );
      setObservationData((_draft) => {
        if (observationList.length) {
          _draft.l.push(...deDupeObservations(_draft.l, observationList));
          _draft.hasMore = observationList.length === Number(filter.f.limit);
        }
        _draft.n = observationList.length;
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
    <DataTableObservationContext.Provider
      value={{
        filter: filter.f,
        observationData,
        nextPage,
        resetFilter
      }}
    >
      {props.children}
    </DataTableObservationContext.Provider>
  );
};
export default function useDataTableObservation() {
  return useContext(DataTableObservationContext);
}
