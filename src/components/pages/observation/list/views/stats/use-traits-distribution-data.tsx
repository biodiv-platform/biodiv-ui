import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTraitsDistributionData({ filter }) {
  const [groupByTraits, setGroupByTraits] = useImmer({
    list: [],
    isLoading: true
  });

  const fetchGroupByTraits = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter
    });

    setter((_draft) => {
      if (success) {
        _draft.list = data.aggregateStatsData.groupTraits;
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchGroupByTraits(setGroupByTraits);
  }, [filter]);

  return {
    data: groupByTraits
  };
}