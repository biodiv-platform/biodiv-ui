import { axGetListData } from "@services/observation.service";
import { STATS_FILTER } from "@static/constants";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const UPLOADERS_LIMIT = 10;

export default function useTopUploaders({ filter }) {
  const [topUploaders, setTopUploaders] = useImmer({
    list: [],
    uploadersoffset: 0,
    isLoading: true
  });

  const loadMore = async (getter, setter, reset) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      uploadersoffset: reset ? 0 : getter.uploadersoffset,
      statsFilter: STATS_FILTER.UPLOADERS
    });

    setter((_draft) => {
      if (success && data.aggregateStatsData) {
        if (reset) {
          _draft.list = data.aggregateStatsData.groupTopUploaders;
          _draft.uploadersoffset = UPLOADERS_LIMIT;
        } else {
          if (data.aggregateStatsData.groupTopUploaders) {
            _draft.list.push(...data.aggregateStatsData.groupTopUploaders);
            _draft.uploadersoffset = _draft.uploadersoffset + UPLOADERS_LIMIT;
          }
        }
      }
      _draft.isLoading = false;
    });
  };

  const loadMoreUploaders = () => loadMore(topUploaders, setTopUploaders, false);

  useEffect(() => {
    loadMore(topUploaders, setTopUploaders, true);
  }, [filter]);

  return {
    uploadersData: { data: topUploaders, loadMore: loadMoreUploaders }
  };
}
