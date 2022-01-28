import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { axGetSpeciesList } from "@services/species.service";
import { isBrowser } from "@static/constants";
import { stringify } from "@utils/query-string";
import { getSpeciesFieldHeaders } from "@utils/species";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

export interface SpeciesListData {
  l: any[];
  ag: any;
  n: number;
  hasMore: boolean;
}

interface SpeciesContextProps {
  filter?;
  speciesData: SpeciesListData;
  species: any;
  fieldsMeta: any;
  traits: any;
  addFilter?;
  pushSpeciesFieldFilter?;
  popSpeciesFieldFilter?;
  removeFilter?;
  children?;
  nextPage?;
  setFilter?;
  resetFilter?;
}

const deDupeDownloadLog = (current, latest) => {
  const existingIDs = current.map(({ id }) => id);
  return latest.filter(({ id }) => !existingIDs.includes(id));
};

const SpeciesContext = createContext<SpeciesContextProps>({} as SpeciesContextProps);

export const SPECIES_PAGE_SIZE = 10;

export const SpeciesListProvider = (props: SpeciesContextProps) => {
  const [speciesData, setSpeciesData] = useImmer<any>(props.speciesData);
  const [filter, setFilter] = useImmer<{ f: any }>({ f: props.filter });
  const [species] = useImmer<{ f: any }>(props.species);
  const [traits] = useImmer<{ f: any }>(props.traits);
  const [fieldsMeta] = useImmer<any>(getSpeciesFieldHeaders(props.fieldsMeta));

  useDidUpdateEffect(() => {
    fetchListData();
  }, [filter]);

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
        setSpeciesData((_draft) => {
          _draft.l = [];
        });
      }
      const { view, description, ...rest } = filter.f;
      const { data } = await axGetSpeciesList({
        ...rest,
        ...deconstructSpeciesFieldFilter(description)
      });
      setSpeciesData((_draft) => {
        if (data?.speciesTiles?.length) {
          _draft.l.push(...deDupeDownloadLog(_draft.l, data.speciesTiles));
          _draft.hasMore =
            data?.totalCount > filter?.f?.offset && data?.totalCount !== _draft.l.length;
          _draft.ag = data.aggregationData;
        } else {
          _draft.hasMore = false;
        }
        _draft.n = data?.totalCount;
      });
      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  const deconstructSpeciesFieldFilter = (sField): any => {
    if (sField?.length) {
      const path = sField.map((item) => item.split(".")[0]).join();
      const description = sField.map((item) => item.split(".")[1]).join();
      return { path, description };
    }
    return {};
  };

  const nextPage = (max = 10) => {
    setFilter((_draft) => {
      _draft.f.offset = Number(_draft.f.offset) + max;
    });
  };

  const addFilter = (key, value) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f[key] = value;
    });
  };
  const pushSpeciesFieldFilter = (key, value) => {
    setFilter((_draft) => {
      if (value && !_draft.f[key]?.includes(value)) {
        const filterList = _draft.f[key]?.filter((item) => !item.includes(value.split(".")[0]));
        _draft.f.offset = 0;
        _draft.f[key] = _draft.f[key] ? [...filterList, value] : [value];
      }
    });
  };

  const popSpeciesFieldFilter = (key, path) => {
    setFilter((_draft) => {
      if (_draft.f[key] && _draft.f[key]?.length > 0) {
        _draft.f.offset = 0;
        if (_draft.f[key]?.length <= 1) {
          removeFilter(key);
        } else {
          _draft.f[key] = _draft.f[key]?.filter((item) => !item.includes(path));
        }
      }
    });
  };

  const removeFilter = (key) => {
    setFilter((_draft) => {
      delete _draft.f[key];
    });
  };

  const resetFilter = () => {
    setFilter((_draft) => {
      _draft.f = { offset: 0 };
    });
  };

  return (
    <SpeciesContext.Provider
      value={{
        filter,
        speciesData,
        fieldsMeta,
        species,
        traits,
        addFilter,
        popSpeciesFieldFilter,
        pushSpeciesFieldFilter,
        removeFilter,
        nextPage,
        setFilter,
        resetFilter
      }}
    >
      {props.children}
    </SpeciesContext.Provider>
  );
};

export default function useSpeciesList() {
  return useContext(SpeciesContext);
}
