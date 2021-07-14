import { axGetTaxonDetails, axGetTaxonListData, axGetTaxonTree } from "@services/taxonomy.service";
import { isBrowser } from "@static/constants";
import { TAXON } from "@static/events";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/taxon";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useListener } from "react-gbus";
import { useImmer } from "use-immer";

interface TaxonFilterContextProps {
  taxonRanks?;
  filter?;
  setFilter?;
  addFilter?;
  removeFilter?;
  resetFilter?;
  children?;
  nextPage?;
  taxonListData?;
  isLoading?;
  selectedTaxons?;
  setSelectedTaxons?;

  modalTaxon?;
  setModalTaxon?;
}

const TaxonFilterContext = createContext<TaxonFilterContextProps>({} as TaxonFilterContextProps);

export const TaxonFilterProvider = (props: TaxonFilterContextProps) => {
  const initialOffset = props?.filter?.offset || 0;
  const [filter, setFilter] = useImmer<{ f: any }>({ f: props.filter });
  const [taxonListData, setTaxonListData] = useImmer<any>({ l: [], count: 0 });
  const [isLoading, setIsLoading] = useState<boolean>();
  const [selectedTaxons, setSelectedTaxons] = useState([]);
  const [modalTaxon, setModalTaxonI] = useState<any>();

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f, offset: initialOffset })}`);
    }
  }, [filter]);

  const fetchListData = async () => {
    try {
      NProgress.start();
      setIsLoading(true);

      // Reset list data if params are changed
      if (filter.f?.offset === 0) {
        setTaxonListData((_draft) => {
          _draft.l = [];
          _draft.count = 0;
        });
      }

      const { data } = await axGetTaxonListData(filter.f);
      setTaxonListData((_draft) => {
        if (data?.taxonomyNameListItems) {
          _draft.l.push(...data?.taxonomyNameListItems);
          _draft.count = data.count;
        }
      });
    } catch (e) {
      console.error(e);
    }
    NProgress.done();
    setIsLoading(false);
  };

  useEffect(() => {
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

  const nextPage = (max = LIST_PAGINATION_LIMIT) => {
    setFilter((_draft) => {
      _draft.f.offset = Number(_draft.f.offset) + max;
    });
  };

  const resetFilter = () => {
    setFilter((_draft) => {
      _draft.f = DEFAULT_FILTER;
    });
  };

  useListener(
    (taxonId) => {
      // TODO: remove double XHR once back-end updates endpoint this
      Promise.all([axGetTaxonDetails(taxonId), axGetTaxonTree(taxonId)]).then(
        ([taxonDetails, taxonTree]) => {
          setModalTaxonI({ ...taxonDetails.data, ranks: taxonTree.data });
        }
      );
    },
    [TAXON.SELECTED]
  );

  const setModalTaxon = async (taxon) => {
    // update modal taxon instance
    setModalTaxonI(taxon);

    // update taxon in list
    if (taxon) {
      await axGetTaxonTree(taxon.id)
      setTaxonListData((_draft) => {
        const taxonIndex = _draft.l.findIndex((listTaxon) => listTaxon.id === taxon.id);
        if (taxonIndex > -1) {
          _draft.l[taxonIndex] = taxon;
        }
      });
    }
  };

  return (
    <TaxonFilterContext.Provider
      value={{
        taxonRanks: props.taxonRanks,
        filter: filter.f,
        setFilter,
        addFilter,
        removeFilter,
        nextPage,
        resetFilter,
        taxonListData,
        isLoading,

        selectedTaxons,
        setSelectedTaxons,

        modalTaxon,
        setModalTaxon
      }}
    >
      {props.children}
    </TaxonFilterContext.Provider>
  );
};

export default function useTaxonFilter() {
  return useContext(TaxonFilterContext);
}
