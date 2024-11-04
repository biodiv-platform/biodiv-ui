import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTaxonTreeData({ filter }) {
  const [groupByTaxon, setGroupByTaxon] = useImmer({
    list: [],
    isLoading: true
  });

  const fetchGroupByTaxon = async (setter, taxonId) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      taxon: taxonId
    });

    setter((_draft) => {
      if (success) {
        _draft.list = data.aggregateStatsData.groupTaxon;
      }
      _draft.isLoading = false;
    });
  };

  const loadMore = (taxonId) => fetchGroupByTaxon(setGroupByTaxon, taxonId);

  useEffect(() => {
    fetchGroupByTaxon(setGroupByTaxon, "1");
  }, [filter]);

  return {
    data: groupByTaxon,
    loadMore: loadMore
  };
}
