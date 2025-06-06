import { axGetListData } from "@services/observation.service";
import { useImmer } from "use-immer";

const UPLOADERS_LIMIT = 10;

export default function useTopUploaders({ filter }) {
  const [topUploaders, setTopUploaders] = useImmer({
    list: [],
    uploadersoffset: 10,
    isLoading: false
  });

  const loadMore = async (getter, setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetListData({
      ...filter,
      uploadersoffset: getter.uploadersoffset
    });

    setter((_draft) => {
      if (success) {
        const newUploaders = data.aggregateStatsData.groupTopUploaders || [];

        _draft.list.push(...newUploaders);
        _draft.uploadersoffset += UPLOADERS_LIMIT;
      }
      _draft.isLoading = false;
    });
  };

  const loadMoreUploaders = () => loadMore(topUploaders, setTopUploaders);

  return {
    uploadersData: {
      data: topUploaders,
      loadMore: loadMoreUploaders
    }
  };
}
