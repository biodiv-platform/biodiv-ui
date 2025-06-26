import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTemporalDistributionMonthObserved({ filter }) {
  const [temporalDistributionData, setTemporalDistributionData] = useImmer({
    list: [],
    isLoading: true,
    maxDate: "2025",
    minDate: "2025"
  });

  const { minDate, maxDate, ...remaining_filter } = filter;

  const fetchMinAndMaxDates = async () => {
    const { success, data } = await axGetListData({
      ...filter,
      statsFilter: "min|from_date"
    });

    if (success && data.aggregateStatsData) {
      const maxYear = data.aggregateStatsData?.maxDate?.split("-")[0];
      const minYear = data.aggregateStatsData?.minDate?.split("-")[0];

      setTemporalDistributionData((_draft) => {
        _draft.maxDate = maxYear;
        _draft.minDate = minYear;
      });

      fetchTemporalDistributionData(
        (parseInt(maxYear, 10) - 49 > 0 ? parseInt(maxYear, 10) - 49 : 0).toString() + "-" + maxYear
      );
    }
  };

  const fetchTemporalDistributionData = async (year) => {
    if (!Object.keys(temporalDistributionData.list).includes(year)) {
      setTemporalDistributionData((_draft) => {
        _draft.isLoading = true;
      });

      const { success, data } = await axGetListData({
        ...remaining_filter,
        minDate:
          minDate && minDate > year.split("-")[0] + "-01-01T00:00:00Z"
            ? minDate
            : year.split("-")[0] + "-01-01T00:00:00Z",
        maxDate:
          maxDate && maxDate < year.split("-")[1] + "-12-31T00:00:00Z"
            ? maxDate
            : year.split("-")[1] + "-12-31T00:00:00Z",
        statsFilter: "observedOn"
      });

      setTemporalDistributionData((_draft) => {
        if (success && data.aggregateStatsData) {
          _draft.list = {
            ...temporalDistributionData.list,
            ...data.aggregateStatsData.groupObservedOn
          };
        }
        _draft.isLoading = false;
      });
    }
  };

  useEffect(() => {
    fetchMinAndMaxDates();
  }, [filter]);

  return {
    data: temporalDistributionData,
    loadMore: fetchTemporalDistributionData
  };
}
