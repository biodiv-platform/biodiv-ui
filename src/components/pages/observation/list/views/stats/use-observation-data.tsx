import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useObservationData({ filter }) {
  const [temporalDistributionData, setTemporalDistributionData] = useImmer({
    list: {
      countPerDay: {},
      groupObservedOn: {},
      groupTraits: [],
      groupTaxon:{}
    },
    isLoading: true
  });

  const fetchTemporalDistributionData = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      statsFilter: "taxon"
    });

    setter((_draft) => {
      if (success) {
        _draft.list = { ...data.aggregateStatsData };
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
