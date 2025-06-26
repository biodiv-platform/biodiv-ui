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
      statsFilter: offset
    });

    setGroupByTaxon((_draft) => {
      if (success && data.aggregateStatsData) {
        _draft.list = { ...groupByTaxon.list, ...data.aggregateStatsData.groupTaxon };
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchGroupByTaxon("taxon");
  }, [filter]);

  const fetchMoreChildren = (taxon) => {
    if (Object.keys(groupByTaxon.list).filter((key) => key.split("|")[1].startsWith(taxon.split("|")[1])).length==1) {
      fetchGroupByTaxon(`taxon|${taxon.split("|")[1]}`);
    }
  };

  return {
    data: groupByTaxon,
    loadMore: fetchMoreChildren
  };
}
