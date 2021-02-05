import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const LIFE_LIST_LIMIT = 10;

export default function useUniqueSpecies({ filter }) {
  const [uniqueSpecies, setUniqueSpecies] = useImmer({
    list: [],
    lifelistoffset: 0,
    isLoading: true
  });

  const loadMore = async (getter, setter, reset) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      lifelistoffset: reset ? 0 : getter.lifelistoffset
    });

    if (success) {
      setter((_draft) => {
        if (reset) {
          _draft.list = Object.entries(data.aggregateStatsData.groupUniqueSpecies);
          _draft.lifelistoffset = LIFE_LIST_LIMIT;
        } else {
          _draft.list.push(...Object.entries(data.aggregateStatsData.groupUniqueSpecies));
          _draft.lifelistoffset = _draft.lifelistoffset + LIFE_LIST_LIMIT;
        }
      });
    }
    setter((_draft) => {
      _draft.isLoading = false;
    });
  };

  const loadMoreUniqueSpecies = () => loadMore(uniqueSpecies, setUniqueSpecies, false);

  useEffect(() => {
    loadMore(uniqueSpecies, setUniqueSpecies, true);
  }, [filter]);

  return {
    speciesData: { data: uniqueSpecies, loadMore: loadMoreUniqueSpecies }
  };
}
