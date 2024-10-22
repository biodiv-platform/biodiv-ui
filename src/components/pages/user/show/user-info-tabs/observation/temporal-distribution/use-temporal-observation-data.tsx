import { axGetGroupByDayCreatedOn } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTemporalData(userId) {
  const [countPerDay, setCountPerDay] = useImmer({
    list: {},
    isLoading: true
  });

  const fetchCountPerDay = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetGroupByDayCreatedOn(userId);

    setter((_draft) => {
      if (success) {
        _draft.list = { ...data };
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchCountPerDay(setCountPerDay);
  }, [userId]);

  return {
    data: countPerDay
  };
}
