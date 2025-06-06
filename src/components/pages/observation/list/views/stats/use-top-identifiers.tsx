import { axGetListData } from "@services/observation.service";
import { useImmer } from "use-immer";

const IDENTIFIERS_LIMIT = 10;

export default function useTopIdentifiers({ filter }) {
  const [topIdentifiers, setTopIdentifiers] = useImmer({
    list: [],
    identifiersoffset: 10,
    isLoading: false
  });

  const loadMore = async (getter, setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      identifiersoffset: getter.identifiersoffset
    });

    setter((_draft) => {
      if (success) {
        const newIndentifiers = data.aggregateStatsData.groupTopIdentifiers || [];

        _draft.list.push(...newIndentifiers);
        _draft.identifiersoffset += IDENTIFIERS_LIMIT;
      }
      _draft.isLoading = false;
    });
  };

  const loadMoreIdentifiers = () => loadMore(topIdentifiers, setTopIdentifiers);

  return {
    identifiersData: { data: topIdentifiers, loadMore: loadMoreIdentifiers }
  };
}
