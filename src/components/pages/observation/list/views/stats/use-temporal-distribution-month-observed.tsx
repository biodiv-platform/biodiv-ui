import { axGetListData } from "@services/observation.service";
import { STATS_FILTER } from "@static/constants";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTemporalDistributionMonthObserved({ filter }) {
  const [temporalDistributionData, setTemporalDistributionData] = useImmer({
    list: [],
    isLoading: true,
    /** false when the filter matches no observations with a date */
    hasData: false,
    maxDate: "2025",
    minDate: "2025"
  });

  const { minDate, maxDate, ...remaining_filter } = filter;

  const fetchMinAndMaxDates = async () => {
    const { success, data } = await axGetListData({
      ...filter,
      statsFilter: "min|from_date"
    });

    const maxYear = data?.aggregateStatsData?.maxDate?.split("-")[0];
    const minYear = data?.aggregateStatsData?.minDate?.split("-")[0];

    if (!success || !maxYear || !minYear) {
      // nothing to chart: stop loading instead of waiting forever
      setTemporalDistributionData((_draft) => {
        _draft.isLoading = false;
        _draft.hasData = false;
      });
      return;
    }

    setTemporalDistributionData((_draft) => {
      _draft.maxDate = maxYear;
      _draft.minDate = minYear;
      _draft.hasData = true;
    });

    fetchTemporalDistributionData(
      (parseInt(maxYear, 10) - 49 > 0 ? parseInt(maxYear, 10) - 49 : 0).toString() + "-" + maxYear
    );
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
        statsFilter: STATS_FILTER.OBSERVED_ON
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
