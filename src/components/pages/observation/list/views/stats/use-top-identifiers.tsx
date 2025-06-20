import { axGetListData } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const IDENTIFIERS_LIMIT = 10;

export default function useTopIdentifiers({ filter }) {
  const [topIdentifiers, setTopIdentifiers] = useImmer({
    list: [],
    identifiersoffset: 0,
    isLoading: true
  });

  const loadMore = async (getter, setter, reset) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      identifiersoffset: reset ? 0 : getter.identifiersoffset,
      statsFilter: "identifiers"
    });

    setter((_draft) => {
      if (success) {
        if (reset) {
          _draft.list = data.aggregateStatsData.groupTopIdentifiers;
          _draft.identifiersoffset = IDENTIFIERS_LIMIT;
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

  const loadMoreIdentifiers = () => loadMore(topIdentifiers, setTopIdentifiers, false);

  useEffect(() => {
    loadMore(topIdentifiers, setTopIdentifiers, true);
  }, [filter]);

  return {
    identifiersData: { data: topIdentifiers, loadMore: loadMoreIdentifiers }
  };
}
