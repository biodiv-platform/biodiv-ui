import useGlobalState from "@hooks/use-global-state";
import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const defaultFilter = {
  sort: "created_on",
  view: "list_minimal"
};

const useSpeciesOccurancesList = (speciesId, max = 16) => {
  const { currentGroup } = useGlobalState();

  const [speciesOccurances, setSpeciesOccurances] = useImmer({
    isLoading: false,
    list: [] as any[],
    hasMore: true,
    offset: 0,
    total: 0,
    hasStats: false
  });

  const loadMore = async (reset?: boolean) => {
    setSpeciesOccurances((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      offset: reset ? 0 : speciesOccurances.offset,
      taxon: speciesId,
      userGroupList: currentGroup?.id || undefined
    });

    if (success) {
      setSpeciesOccurances((_draft) => {
        if (reset) {
          _draft.list = [];
          _draft.hasMore = true;
        }

        _draft.list.push(...data.observationListMinimal);
        _draft.isLoading = false;

        if (data.observationListMinimal.length !== max) {
          _draft.hasMore = false;
        }

        _draft.offset = reset ? max : _draft.offset + max;
        _draft.hasStats = true;
        _draft.total = data.totalCount;
      });
    }
  };

  useEffect(() => {
    loadMore(true);
  }, [speciesId]);

  return {
    speciesOccurances,
    loadMore
  };
};

export default useSpeciesOccurancesList;
