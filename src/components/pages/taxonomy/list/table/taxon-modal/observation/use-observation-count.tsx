import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useObsCount(taxonId) {
  const [count, setCount] = useImmer({
    value: null,
    isLoading: true
  });

  const getData = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      taxon: taxonId
    });

    setter((_draft) => {
      if (success) {
        _draft.value = data.totalCount;
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    getData(setCount);
  }, []);

  return {
    countsData: { data: count }
  };
}
