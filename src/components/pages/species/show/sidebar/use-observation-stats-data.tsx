import useGlobalState from "@hooks/use-global-state";
import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";
const defaultFilter = {
  sort: "created_on",
  view: "stats"
};
export default function useObservationStatsData(speciesId, max = 8) {
  const { currentGroup } = useGlobalState();
  const [temporalDistributionData, setTemporalDistributionData] = useImmer({
    list: {
      groupTraits: [],
      groupObservedOn: {}
    },
    isLoading: true
  });

  const fetchTemporalDistributionData = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      offset: 0,
      userGroupList: currentGroup?.id || undefined,
      taxon: String(speciesId)
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
  }, []);

  return {
    data: temporalDistributionData
  };
}
