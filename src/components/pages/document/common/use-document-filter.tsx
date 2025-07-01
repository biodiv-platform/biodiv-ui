import useDidUpdateEffect from "@hooks/use-did-update-effect";
import useGlobalState from "@hooks/use-global-state";
import { DocumentData } from "@interfaces/custom";
import { UserGroupIbp } from "@interfaces/document";
import { axGetListData } from "@services/document.service";
import { axGetLandscapeList } from "@services/landscape.service";
import { axGetSpeciesGroupList } from "@services/taxonomy.service";
import { axGetUserGroupList } from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { isBrowser } from "@static/constants";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/documnet-list";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

interface DocumentFilterContextProps {
  filter?;
  documentData: DocumentData;
  setDocumentData?;
  totalCount?;
  documentListAdd?;
  setFilter?;
  addFilter?;
  removeFilter?;
  children?;
  nextPage?;
  resetFilter?;
  loggedInUserGroups?: UserGroupIbp[];
  species;
  habitats;
  protectedAreas?: any[];
}

const DocumentFilterContext = createContext<DocumentFilterContextProps>(
  {} as DocumentFilterContextProps
);

export const DocumentFilterProvider = (props) => {
  const initialOffset = props.filter.offset;
  const [filter, setFilter] = useImmer({ f: props.filter });
  const [documentData, setDocumentData] = useImmer(props.documentData);
  const { isLoggedIn } = useGlobalState();
  const [loggedInUserGroups, setLoggedInUserGroups] = useState<UserGroupIbp[]>();
  const [habitats, setHabitats] = useState();
  const [species, setSpecies] = useState();
  const [protectedAreas, setProtectedAreas] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      axGetUserGroupList().then(({ data }) => setLoggedInUserGroups(data));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f, offset: initialOffset })}`);
    }

    axGetSpeciesGroupList().then(({ data: species }) => {
      setSpecies(species);
    });
    axGetAllHabitat().then(({ data: habitat }) => {
      setHabitats(habitat);
    });
    axGetLandscapeList({}).then(({ data: protectedAreas }) => {
      setProtectedAreas(protectedAreas);
    });
  }, [filter]);

  const fetchListData = async () => {
    try {
      NProgress.start();
      const { location, ...otherValues } = filter.f;
      const { data } = await axGetListData({ ...otherValues }, location ? { location } : {});
      setDocumentData((_draft) => {
        if (filter.f.offset === 0) {
          _draft.l = [];
        }
        if (data?.documentList?.length) {
          _draft.l.push(...data.documentList);
          _draft.hasMore =
            data.totalCount > Number(filter.f.offset) && data.totalCount !== _draft.l.length;
        }
        _draft.n = data.totalCount;
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

  const documentListAdd = (items) => {
    setDocumentData((_draft) => {
      _draft.l.push(...items);
    });
  };

  return (
    <DocumentFilterContext.Provider
      value={{
        filter: filter.f,
        documentData,
        setDocumentData,
        documentListAdd,
        setFilter,
        addFilter,
        removeFilter,
        nextPage,
        resetFilter,
        loggedInUserGroups,
        habitats,
        species,
        protectedAreas
      }}
    >
      {props.children}
    </DocumentFilterContext.Provider>
  );
};

export default function useDocumentFilter() {
  return useContext(DocumentFilterContext);
}
