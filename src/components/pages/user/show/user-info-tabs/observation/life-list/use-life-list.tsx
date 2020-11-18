import useGlobalState from "@hooks/use-global-state";
import { axGetUserLifeList } from "@services/observation.service";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const LIFE_LIST_LIMIT = 10;

export default function useLifeList(userId, filter) {
  const { currentGroup } = useGlobalState();
  const [uploaded, setUploaded] = useImmer({
    type: "uploaded",
    list: [],
    hasMore: true,
    offset: 0,
    total: 0,
    isLoading: true
  });
  const [identified, setIdentified] = useImmer({
    type: "identified",
    list: [],
    hasMore: true,
    offset: 0,
    total: 0,
    isLoading: true
  });

  const loadMore = async (getter, setter, reset) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetUserLifeList(userId, getter.type, {
      ...filter,
      userGroupId: currentGroup?.id || undefined,
      offset: reset ? 0 : getter.offset
    });

    if (success) {
      setter((_draft) => {
        if (reset) {
          _draft.list = data.uniqueSpeciesInfos;
          _draft.total = data.totalCount;
          _draft.offset = LIFE_LIST_LIMIT;
        } else {
          _draft.list.push(...data.uniqueSpeciesInfos);
          _draft.offset = _draft.offset + LIFE_LIST_LIMIT;
        }
        _draft.hasMore = data.length === LIFE_LIST_LIMIT;
        _draft.isLoading = false;
      });
    } else {
      setter((_draft) => {
        _draft.isLoading = false;
      });
    }
  };

  const loadMoreUploaded = () => loadMore(uploaded, setUploaded, false);
  const loadMoreIdentified = () => loadMore(identified, setIdentified, false);

  useEffect(() => {
    loadMore(uploaded, setUploaded, true);
    loadMore(identified, setIdentified, true);
  }, [filter]);

  return {
    uploaded: { data: uploaded, loadMore: loadMoreUploaded },
    identified: { data: identified, loadMore: loadMoreIdentified }
  };
}
