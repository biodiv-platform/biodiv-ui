import { axGetListData } from "@services/observation.service";
import { STATS_FILTER } from "@static/constants";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTotals({ filter }) {
  const [totals, setTotals] = useImmer({
    list: {},
    isLoading: true
  });

  const fetchTotals = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      statsFilter: STATS_FILTER.TOTALS
    });

    setter((_draft) => {
      if (success && data.aggregateStatsData) {
        _draft.list = { ...data.aggregateStatsData.totalCounts };
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchTotals(setTotals);
  }, [filter]);

  return {
    totalsData: { data: totals }
  };
}
