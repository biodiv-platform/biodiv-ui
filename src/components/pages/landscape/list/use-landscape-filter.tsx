import useDidUpdateEffect from "@hooks/useDidUpdateEffect";
import { Landscape } from "@interfaces/landscape";
import { axGetLandscapeList } from "@services/landscape.service";
import { isBrowser } from "@static/constants";
import { LANDSCAPE_DEFAULT_FILTER, LANDSCAPE_LIST_PAGINATION_LIMIT } from "@static/landscape-list";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

interface LandscapeFilterContextProps {
  filter?;
  landscapeData?: { l: Landscape[]; hasMore: boolean };
  setFilter?;
  addFilter?;
  removeFilter?;
  resetFilter?;
  children?;
  nextPage?;
}

const LandscapeFilterContext = createContext<LandscapeFilterContextProps>(
  {} as LandscapeFilterContextProps
);

export const LandscapeFilterProvider = (props: LandscapeFilterContextProps) => {
  const initialOffset = props.filter.offset;
  const [filter, setFilter] = useImmer({ f: props.filter });
  const [landscapeData, setLandscapeData] = useImmer(props.landscapeData);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f, offset: initialOffset })}`);
    }
  }, [filter]);

  const fetchListData = async () => {
    NProgress.start();
    try {
      const { data } = await axGetLandscapeList(filter.f);
      setLandscapeData((_draft) => {
        if (filter.f.offset === 0) {
          _draft.l = [];
        }
        _draft.l.push(...data);
        _draft.hasMore = data.length === Number(filter.f.max);
      });
    } catch (e) {
      console.error(e);
    }
    NProgress.done();
  };

  useDidUpdateEffect(() => {
    fetchListData();
  }, [filter]);

  const addFilter = (key, value) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f[key] = value;
    });
  };

  const removeFilter = (key) => {
    setFilter((_draft) => {
      delete _draft.f[key];
    });
  };

  const nextPage = (max = LANDSCAPE_LIST_PAGINATION_LIMIT) => {
    setFilter((_draft) => {
      _draft.f.offset = Number(_draft.f.offset) + max;
    });
  };

  const resetFilter = () => {
    setFilter((_draft) => {
      _draft.f = LANDSCAPE_DEFAULT_FILTER;
    });
  };

  return (
    <LandscapeFilterContext.Provider
      value={{
        filter: filter.f,
        landscapeData,
        setFilter,
        addFilter,
        removeFilter,
        nextPage,
        resetFilter
      }}
    >
      {props.children}
    </LandscapeFilterContext.Provider>
  );
};

export default function useLandscapeFilter() {
  return useContext(LandscapeFilterContext);
}
