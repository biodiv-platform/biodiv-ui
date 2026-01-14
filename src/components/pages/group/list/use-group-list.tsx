import useGlobalState from "@hooks/use-global-state";
import { axMemberGroupList, axMemberGroupListByUserId } from "@services/usergroup.service";
import { isBrowser } from "@static/constants";
import { DEFAULT_FILTER } from "@static/documnet-list";
import { removeEmptyKeys } from "@utils/basic";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

interface GroupListFilterContextProps {
  children?;
  filter?;
  groupListData?;
  groupJoinedStatus?;
  setGroupJoinedStatus?;
  userId?;

  speciesGroups?;
  habitat?;

  addFilter?;
  removeFilter?;
  resetFilter?;
}

const GroupListFilterContext = createContext<GroupListFilterContextProps>(
  {} as GroupListFilterContextProps
);

export const GroupListFilterProvider = (props) => {
  const [filter, setFilter] = useImmer({ f: props.filter });
  const [groupListData, setGroupListData] = useImmer(props.userGroupList);

  const { isLoggedIn } = useGlobalState();
  const [groupJoinedStatus, setGroupJoinedStatus] = useState<any>();

  useEffect(() => {
    if (props.userId) {
      axMemberGroupListByUserId(props.userId).then(({ data }) => setGroupJoinedStatus(data));
    } else if (isLoggedIn) {
      axMemberGroupList().then(({ data }) => setGroupJoinedStatus(data));
    } else {
      setGroupJoinedStatus({});
    }
  }, [isLoggedIn, props.userId]);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify(filter.f)}`);
    }
  }, [filter]);

  useEffect(() => {
    setGroupListData(props.userGroupList);
  }, [props.userGroupList]);

  const filterData = async () => {
    try {
      NProgress.start();

      const filterKeys: any = Object.entries(removeEmptyKeys(filter.f));

      setGroupListData(
        filterKeys.length > 0 // show all by default if no filters then
          ? props.userGroupList.filter((o) =>
              filterKeys.find(([filterKey, filterValues]) =>
                filterValues.find((filterValue) => o[filterKey].includes(filterValue))
              )
            )
          : props.userGroupList
      );

      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  useEffect(() => {
    filterData();
  }, [filter]);

  const addFilter = (key, value) => {
    setFilter((_draft) => {
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
      _draft.f = DEFAULT_FILTER;
    });
  };

  return (
    <GroupListFilterContext.Provider
      value={{
        filter: filter.f,
        groupListData,
        userId: props.userId,
        addFilter,
        removeFilter,
        resetFilter,

        speciesGroups: props.speciesGroups,
        habitat: props.habitat,

        groupJoinedStatus,
        setGroupJoinedStatus
      }}
    >
      {props.children}
    </GroupListFilterContext.Provider>
  );
};

export default function useGroupListFilter() {
  return useContext(GroupListFilterContext);
}
