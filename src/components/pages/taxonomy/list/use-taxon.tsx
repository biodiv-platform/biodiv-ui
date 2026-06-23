import { useDisclosure } from "@chakra-ui/react";
import { axGetTaxonDetails, axTaxonomyList } from "@services/taxonomy.service";
import { isBrowser } from "@static/constants";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/taxon";
import { removeEmptyKeys } from "@utils/basic";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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

  showTaxon?;
  setShowTaxon?;

  isOpen?;
  onOpen?;
  onClose?;
}

const TaxonFilterContext = createContext<TaxonFilterContextProps>({} as TaxonFilterContextProps);

export const TaxonFilterProvider = (props: TaxonFilterContextProps) => {
  const initialOffsetPath = props?.filter?.offsetPath || "";
  const initialOffsetId = props?.filter?.offsetId || -1;
  const offsetPath = useRef(initialOffsetPath);
  const offsetId = useRef(initialOffsetId);

  const [filter, setFilter] = useImmer<{ f: any }>({ f: props.filter });
  const [taxonListData, setTaxonListData] = useImmer<any>({ l: [], count: 0, hasMore: true });
  const [isLoading, setIsLoading] = useState<boolean>();

  const [selectedTaxons, setSelectedTaxons] = useState([]);
  const { open, onOpen, onClose } = useDisclosure();

  const [modalTaxon, setModalTaxonI] = useState<any>();
  const [showTaxon, setShowTaxon] = useState<any>(filter.f.showTaxon);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState(
        "",
        "",
        `?${stringify(
          removeEmptyKeys({
            ...filter.f,
            showTaxon,
            offsetPath: initialOffsetPath,
            offsetId: initialOffsetId
          })
        )}`
      );
    }
  }, [filter, modalTaxon]);

  const fetchListData = async () => {
    try {
      NProgress.start();
      setIsLoading(true);

      // Reset list data if params are changed
      if (filter.f?.offsetPath === "" && filter.f?.offsetId === -1) {
        setTaxonListData((_draft) => {
          _draft.l = [];
          _draft.count = 0;
        });
      }

      //const { data } = await axGetTaxonListData(filter.f);
      const { data } = await axTaxonomyList(filter.f);
      setTaxonListData((_draft) => {
        if (data?.taxonomyNameListItems) {
          _draft.l.push(...(data?.taxonomyNameListItems || []));
          _draft.count = data.count;
          _draft.hasMore = data?.taxonomyNameListItems.length < LIST_PAGINATION_LIMIT;
        }
      });
      offsetPath.current = data?.acceptedPath;
      offsetId.current = data?.taxonomyNameListItems[data?.taxonomyNameListItems.length - 1].id;
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
      _draft.f.offsetPath = "";
      _draft.f.offsetId = -1;
      _draft.f[key] = value;
    });
  };

  const removeFilter = (key) => {
    setFilter((_draft) => {
      delete _draft.f[key];
    });
  };

  const nextPage = () => {
    setFilter((_draft) => {
      _draft.f.offsetPath = offsetPath.current;
      _draft.f.offsetId = offsetId.current;
    });
  };

  const resetFilter = () => {
    setFilter((_draft) => {
      _draft.f = DEFAULT_FILTER;
    });
  };

  useEffect(() => {
    if (showTaxon) {
      axGetTaxonDetails(showTaxon).then(({ data: { taxonomyDefinition, ...extra } }) =>
        setModalTaxonI({ ...taxonomyDefinition, ...extra })
      );
    } else {
      setModalTaxonI(undefined);
    }
  }, [showTaxon]);

  const setModalTaxon = async (taxon) => {
    // Transformer to match data
    const data = {
      ...taxon,
      ...taxon?.taxonomyDefinition,
      taxonomyDefinition: undefined
    };

    if (data) {
      // update `modalTaxon` value
      setModalTaxonI(data);

      // update existing object in list
      setTaxonListData((_draft) => {
        const taxonIndex = _draft.l.findIndex((listTaxon) => listTaxon.id === data.id);
        if (taxonIndex > -1) {
          _draft.l[taxonIndex] = data;
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

        // for table multiple taxon selections
        selectedTaxons,
        setSelectedTaxons,

        // Stores just clicked taxon ID
        showTaxon,
        setShowTaxon,

        // fetches full taxon information once assigned to `showTaxon` for modal
        modalTaxon,
        setModalTaxon,

        isOpen: open,
        onOpen,
        onClose
      }}
    >
      {props.children}
    </TaxonFilterContext.Provider>
  );
};

export default function useTaxonFilter() {
  return useContext(TaxonFilterContext);
}
