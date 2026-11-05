import { useDisclosure } from "@chakra-ui/react";
import { axGetTaxonDetails, axTaxonomyList } from "@services/taxonomy.service";
import { isBrowser } from "@static/constants";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/taxon";
import { removeEmptyKeys } from "@utils/basic";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import { createContext, useContext, useEffect, useRef, useState } from "react";
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
  onSelectionChange?;
  selectAll?: boolean;
  excludedTaxons?: any[];
  selectedCount?: number;

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
  const [taxonListData, setTaxonListData] = useImmer<any>({ l: [], count: -1, hasMore: true });
  const [isLoading, setIsLoading] = useState<boolean>();

  const [selectedTaxons, setSelectedTaxons] = useState<any[]>([]);
  // `selectAll` = every taxon matching the current filter, minus `excludedTaxons`
  const [selectAll, setSelectAll] = useState(false);
  const [excludedTaxons, setExcludedTaxons] = useState<any[]>([]);

  const onSelectionChange = (rows, { selectAll = false, excludedRows = [] }: any = {}) => {
    setSelectedTaxons(rows);
    setSelectAll(selectAll);
    setExcludedTaxons(excludedRows);
  };
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

  // guards against an older (slower) request overwriting the result of a newer one
  const latestRequest = useRef(0);
  const isFetching = useRef(false);

  const fetchListData = async () => {
    const requestId = ++latestRequest.current;
    isFetching.current = true;
    const isFirstPage = !filter.f?.offsetPath && Number(filter.f?.offsetId) === -1;

    try {
      NProgress.start();
      setIsLoading(true);

      // Reset list data if params are changed
      if (isFirstPage) {
        // forget the previous list's cursor and stop infinite scroll until the new first page lands,
        // otherwise emptying the list fires a scroll event that loads "page 2" of the old list
        offsetPath.current = "";
        offsetId.current = -1;
        setTaxonListData((_draft) => {
          _draft.l = [];
          _draft.count = -1;
          _draft.ag = undefined;
          _draft.hasMore = false;
        });
      }

      //const { data } = await axGetTaxonListData(filter.f);
      const { data } = await axTaxonomyList(filter.f);
      if (requestId !== latestRequest.current) return;

      const items = data?.taxonomyNameListItems || [];
      setTaxonListData((_draft) => {
        _draft.l.push(...items);
        _draft.count = typeof data?.count === "number" ? data.count : -1;
        // per-option filter counts, e.g. { groupRank: { species: 120 }, groupStatus: { ACCEPTED: 90 } }
        if (data?.aggregationData && isFirstPage) {
          _draft.ag = data.aggregationData;
        }
        _draft.hasMore = items.length > LIST_PAGINATION_LIMIT;
      });
      if (items.length) {
        offsetPath.current = data?.acceptedPath;
        offsetId.current = items[items.length - 1].id;
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (requestId === latestRequest.current) {
        isFetching.current = false;
        NProgress.done();
        setIsLoading(false);
      }
    }
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
    // ignore scroll triggers while a page is loading or before a cursor exists
    if (isFetching.current || offsetId.current === -1) return;
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
        onSelectionChange,
        selectAll,
        excludedTaxons,
        // falls back to the loaded selection if the list API doesn't return a total `count`
        selectedCount:
          selectAll && taxonListData?.count > 0
            ? Math.max(taxonListData.count - excludedTaxons.length, 0)
            : selectedTaxons.length,

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
