import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useCountPerDay({ filter }) {
  const [countPerDay, setCountPerDay] = useImmer({
    list: {},
    isLoading: true
  });

  const fetchCountPerDay = async (setter) => {
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
    fetchCountPerDay(setCountPerDay);
  }, [filter]);

  return {
     data: countPerDay 
  };
}