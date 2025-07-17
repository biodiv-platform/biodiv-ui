import { axGetListData } from "@services/observation.service";
import { STATS_FILTER } from "@static/constants";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const LIFE_LIST_LIMIT = 10;

export default function useUniqueSpecies({ filter, location = "" }) {
  const [uniqueSpecies, setUniqueSpecies] = useImmer({
    list: [],
    lifelistoffset: 0,
    isLoading: true
  });

  const loadMore = async (getter, setter, reset) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData(
      {
        ...filter,
        lifelistoffset: reset ? 0 : getter.lifelistoffset,
        statsFilter: STATS_FILTER.LIFELIST
      },
      location ? { location } : {}
    );

    setter((_draft) => {
      if (
        success &&
        data.aggregateStatsData &&
        data.aggregateStatsData.groupUniqueSpecies != null
      ) {
        if (reset) {
          _draft.list = Object.entries(data.aggregateStatsData.groupUniqueSpecies);
          _draft.lifelistoffset = LIFE_LIST_LIMIT;
        } else {
          if (data.aggregateStatsData.groupUniqueSpecies) {
            _draft.list.push(...Object.entries(data.aggregateStatsData.groupUniqueSpecies));
            _draft.lifelistoffset = _draft.lifelistoffset + LIFE_LIST_LIMIT;
          }
        }
      }
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
