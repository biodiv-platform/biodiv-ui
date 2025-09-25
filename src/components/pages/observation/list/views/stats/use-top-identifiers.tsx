import { axGetListData } from "@services/observation.service";
import { STATS_FILTER } from "@static/constants";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const IDENTIFIERS_LIMIT = 10;

export default function useTopIdentifiers({ filter }) {
  const [topIdentifiers, setTopIdentifiers] = useImmer({
    list: [],
    identifiersoffset: 0,
    isLoading: true,
    sort: "observations"
  });

  const loadMore = async (getter, setter, reset, sort) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      identifiersoffset: reset ? 0 : getter.identifiersoffset,
      statsFilter: `${STATS_FILTER.IDENTIFIERS}|${sort}`
    });

    setter((_draft) => {
      if (success && data.aggregateStatsData) {
        if (reset) {
          _draft.list = data.aggregateStatsData.groupTopIdentifiers;
          _draft.identifiersoffset = IDENTIFIERS_LIMIT;
          _draft.sort = sort
        } else {
          if (data.aggregateStatsData.groupTopIdentifiers) {
            _draft.list.push(...data.aggregateStatsData.groupTopIdentifiers);
            _draft.identifiersoffset = _draft.identifiersoffset + IDENTIFIERS_LIMIT;
          }
        }
      }
      _draft.isLoading = false;
    });
  };

  const loadMoreIdentifiers = () => loadMore(topIdentifiers, setTopIdentifiers, false, topIdentifiers.sort);

  const changeSortIdentifiers = (sort) => loadMore(topIdentifiers, setTopIdentifiers, true, sort);

  useEffect(() => {
    loadMore(topIdentifiers, setTopIdentifiers, true, "observations");
  }, [filter]);

  return {
    identifiersData: { data: topIdentifiers, loadMore: loadMoreIdentifiers , changeSort: changeSortIdentifiers}
  };
}
