import { axGetGroupMonthObservedOn } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useObservationPerMonth({ filter }) {
  const [observationPerMonth, setObservationPerMonth] = useImmer({
    list: [],
    isLoading: true
  });

  const fetchObservationPerMonth = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetGroupMonthObservedOn(1426);

    setter((_draft) => {
      if (success) {
        _draft.list = data;
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchObservationPerMonth(setObservationPerMonth);
  }, [filter]);

  return {
     data: observationPerMonth 
  };
}