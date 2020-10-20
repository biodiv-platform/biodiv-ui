import useDidUpdateEffect from "@hooks/use-did-update-effect";
import useGlobalState from "@hooks/use-global-state";
import { DocumentData } from "@interfaces/custom";
import { UserGroupIbp } from "@interfaces/document";
import { axGetListData } from "@services/document.service";
import { axGroupList } from "@services/usergroup.service";
import { isBrowser } from "@static/constants";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/documnet-list";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

const deDupeDocument = (exsistinDocument, newDocument) => {
  const existingIDs = exsistinDocument.map(({ id }) => id);
  return newDocument.filter(({ id }) => !existingIDs.includes(id));
};

interface DocumentFilterContextProps {
  filter?;
  documentData?: DocumentData;
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
}

const DocumentFilterContext = createContext<DocumentFilterContextProps>(
  {} as DocumentFilterContextProps
);

export const DocumentFilterProvider = (props) => {
  const initialOffset = props.filter.offset;
  const [filter, setFilter] = useImmer({ f: props.filter });
  const [documentData, setDocumentData] = useImmer(props.documentData);
  const { isLoggedIn } = useGlobalState();
  const [loggedInUserGroups, setLoggedInUserGroups] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      axGroupList().then(({ groups }) => setLoggedInUserGroups(groups));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f, offset: initialOffset })}`);
    }
  }, [filter]);

  const fetchListData = async () => {
    // console.log("the fetch dta")
    try {
      NProgress.start();
      const { data } = await axGetListData(filter.f);
      // console.log("the data form data",data)
      setDocumentData((_draft) => {
        // console.log("the data form data",_draft)
        if (filter.f.offset === 0) {
          _draft.l = [];
        }
        if (data.documentList.length) {
          _draft.l.push(...deDupeDocument(_draft.l, data.documentList));
          _draft.hasMore = data.documentList.length === Number(filter.f.max);
        }
      });
      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  useDidUpdateEffect(() => {
    // console.log("the did update")
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
        loggedInUserGroups
      }}
    >
      {props.children}
    </DocumentFilterContext.Provider>
  );
};

export default function useDocumentFilter() {
  return useContext(DocumentFilterContext);
}
