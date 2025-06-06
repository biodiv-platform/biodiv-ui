import { axGetListData } from "@services/observation.service";
import { useImmer } from "use-immer";

const LIFE_LIST_LIMIT = 10;

export default function useUniqueSpecies({ filter, location = "" }) {
  const [uniqueSpecies, setUniqueSpecies] = useImmer({
    list: [],
    lifelistoffset: 10,
    isLoading: false
  });

  const loadMore = async (getter, setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData(
      {
        ...filter,
        lifelistoffset: getter.lifelistoffset
      },
      location ? { location } : {}
    );

    setter((_draft) => {
      if (success && data.aggregateStatsData.groupUniqueSpecies != null) {
        const newUniqueSpecies = data.aggregateStatsData.groupUniqueSpecies || {};
        _draft.list.push(...Object.entries(newUniqueSpecies));
        _draft.lifelistoffset += LIFE_LIST_LIMIT;
      }
      _draft.isLoading = false;
    });
  };

  const loadMoreUniqueSpecies = () => loadMore(uniqueSpecies, setUniqueSpecies);

  return {
    speciesData: { data: uniqueSpecies, loadMore: loadMoreUniqueSpecies }
  };
}
