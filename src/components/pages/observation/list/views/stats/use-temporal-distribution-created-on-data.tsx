import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTemporalDistributionCreatedOnData({ filter }) {
  const [temporalDistributionData, setTemporalDistributionData] = useImmer({
    list: {},
    isLoading: true,
    maxDate: "2025",
    minDate: "2025"
  });

  const {createdOnMinDate,createdOnMaxDate, ...remaining_filter} = filter

  const fetchMinAndMaxDates = async () => {
    const { success, data } = await axGetListData({
      ...filter,
      statsFilter: "min|created_on"
    });

    if (success && data.aggregateStatsData) {
      const maxYear = data.aggregateStatsData.maxDate?.split("-")[0];
      const minYear = data.aggregateStatsData.minDate?.split("-")[0];

      setTemporalDistributionData((_draft) => {
        _draft.maxDate = maxYear;
        _draft.minDate = minYear;
      });

      // Fetch initial year data (max year)
      fetchTemporalDistributionData(maxYear);
    }
  };

  const fetchTemporalDistributionData = async (year) => {
    if (!Object.keys(temporalDistributionData.list).includes(year)) {
      setTemporalDistributionData((_draft) => {
        _draft.isLoading = true;
      });

      const { success, data } = await axGetListData({
        ...remaining_filter,
        createdOnMinDate: (createdOnMinDate && createdOnMinDate>`${year}-01-01T00:00:00Z`)?createdOnMinDate:`${year}-01-01T00:00:00Z`,
        createdOnMaxDate: (createdOnMaxDate && createdOnMaxDate<`${year}-12-31T00:00:00Z`)?createdOnMaxDate:`${year}-12-31T00:00:00Z`,
        statsFilter: "countPerDay"
      });

      if (success && data.aggregateStatsData) {
        setTemporalDistributionData((_draft) => {
          _draft.list = {
            ..._draft.list, // use _draft.list, not stale outer state
            ...data.aggregateStatsData.countPerDay
          };
          _draft.isLoading = false;
        });
      } else {
        setTemporalDistributionData((_draft) => {
          _draft.isLoading = false;
        });
      }
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
