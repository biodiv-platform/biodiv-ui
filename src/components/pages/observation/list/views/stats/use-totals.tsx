import { axGetListData } from "@services/observation.service";
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
      ...filter
    });

    setter((_draft) => {
      if (success) {
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
