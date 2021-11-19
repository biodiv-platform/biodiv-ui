import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { axGetUserList } from "@services/user.service";
import { isBrowser } from "@static/constants";
import { LIST_PAGINATION_LIMIT } from "@static/documnet-list";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

export interface UserListData {
  l: any[];
  ag: any;
  n: number;
  hasMore: boolean;
}

interface UserListContextProps {
  filter?;
  userListData: UserListData;
  isAdmin: boolean;
  addFilter?;
  removeFilter?;
  children?;
  nextPage?;
  setFilter?;
  resetFilter?;
}

const UserListContext = createContext<UserListContextProps>({} as UserListContextProps);

export function UserListContextProvider(props: UserListContextProps) {
  const [filter, setFilter] = useImmer<{ f: any }>({ f: props.filter });
  const [isAdmin] = useImmer<boolean>(props.isAdmin);

  const [userListData, setuserListData] = useImmer<any>(props.userListData);

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
        setuserListData((_draft) => {
          _draft.l = [];
        });
      }

      const { location, ...otherValues } = filter.f;
      const { data } = await axGetUserList(
        { ...otherValues },
        location ? { location } : {},
        isAdmin
      );
      setuserListData((_draft) => {
        if (data?.userList?.length) {
          _draft.l.push(...data.userList);
          _draft.hasMore =
            data.totalCount > filter?.f?.offset && data?.totalCount !== _draft.l.length;
          _draft.ag = data.aggregationData;
        } else {
          _draft.hasMore = false;
        }
        _draft.n = data.totalCount;
      });
      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  const nextPage = (max = LIST_PAGINATION_LIMIT) => {
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
    <UserListContext.Provider
      value={{
        filter: filter.f,
        isAdmin,
        userListData,
        addFilter,
        setFilter,
        removeFilter,
        nextPage,
        resetFilter
      }}
    >
      {props.children}
    </UserListContext.Provider>
  );
}

export default function useUserList() {
  return useContext(UserListContext);
}
