import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTemporalDistributionCreatedOnData({ filter }) {
  const [temporalDistributionData, setTemporalDistributionData] = useImmer({
    list: {},
    isLoading: true
  });

  const fetchTemporalDistributionData = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter
    });

    setter((_draft) => {
      if (success) {
        _draft.list = { ...data.aggregateStatsData.countPerDay };
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchTemporalDistributionData(setTemporalDistributionData);
  }, [filter]);

  return {
    data: temporalDistributionData
  };
}
