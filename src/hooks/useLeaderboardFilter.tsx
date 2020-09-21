import { LeaderboardFilterProps } from "@interfaces/custom";
import { axGetUserLeaderboard } from "@services/esmodule.service";
import { isBrowser } from "@static/constants";
import { LEADERBOARD_FILTERS } from "@static/leaderboard";
import NProgress from "nprogress";
import { stringify } from "querystring";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

import useDidUpdateEffect from "./use-did-update-effect";
import useGlobalState from "./use-global-state";

interface LeaderboardFilterContextProps {
  filter?: LeaderboardFilterProps;
  leaderboardData?;
  setLeaderboard?;
  setFilter?;
  addFilter?;
  removeFilter?;
  children?;
  resetFilter?;
}

const LeaderboardFilterContext = createContext<LeaderboardFilterContextProps>(
  {} as LeaderboardFilterContextProps
);

export const LeaderboardFilterProvider = (props: LeaderboardFilterContextProps) => {
  const [filter, setFilter] = useImmer({ f: props.filter });
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { user } = useGlobalState();

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f })}`);
    }
  }, [filter]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      NProgress.start();
      const payload = {
        value: filter.f.module,
        how_many: filter.f.limit,
        time: filter.f.period
      };
      const data = await axGetUserLeaderboard(payload, user);
      setLeaderboardData(data);
      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  useDidUpdateEffect(() => {
    fetchLeaderboardData();
  }, [filter]);

  const setLeaderboard = (data) => {
    setLeaderboardData(data);
  };

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
      _draft.f = LEADERBOARD_FILTERS;
    });
  };

  return (
    <LeaderboardFilterContext.Provider
      value={{
        filter: filter.f,
        leaderboardData,
        setLeaderboard,
        setFilter,
        addFilter,
        removeFilter,
        resetFilter
      }}
    >
      {props.children}
    </LeaderboardFilterContext.Provider>
  );
};

export default function useLeaderboardFilter() {
  return useContext(LeaderboardFilterContext);
}
