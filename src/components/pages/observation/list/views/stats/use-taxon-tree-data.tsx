import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export default function useTaxonTreeData({ filter }) {
  const [groupByTaxon, setGroupByTaxon] = useImmer({
    list: [],
    isLoading: true
  });

  const fetchGroupByTaxon = async (offset) => {
    setGroupByTaxon((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      statsFilter:offset
    });

    setGroupByTaxon((_draft) => {
      if (success) {
        _draft.list = {...groupByTaxon.list,...data.aggregateStatsData.groupTaxon};
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchGroupByTaxon("taxon");
  }, [filter]);

  const fetchMoreChildren = (taxon) => {
    fetchGroupByTaxon(`taxon|${taxon.split("|")[1]}`)
  }

  return {
    data: groupByTaxon,
    loadMore: fetchMoreChildren
  };
}
