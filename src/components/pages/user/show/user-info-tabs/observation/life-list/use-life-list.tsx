import { axGetspeciesGroups, axGetUserLifeList } from "@services/observation.service";
import { PAGINATION_LIMIT } from "@static/constants";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

export default function useLifeList(userId) {
  const [speciesGroups, setSpeciesGroups] = useState([]);
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

  const [filter, setFilter] = useState<{ sGroupId; hasMedia }>({
    sGroupId: null,
    hasMedia: true
  });

  const loadMore = async (getter, setter, reset) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetUserLifeList(userId, getter.type, {
      ...filter,
      offset: getter.offset
    });

    if (success) {
      setter((_draft) => {
        if (reset) {
          _draft.list = data.uniqueSpeciesInfos;
          _draft.total = data.totalCount;
        } else {
          _draft.list.push(...data.uniqueSpeciesInfos);
        }
        _draft.hasMore = data.length === PAGINATION_LIMIT;
        _draft.offset = _draft.offset + PAGINATION_LIMIT;
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
    axGetspeciesGroups().then(({ data }) => setSpeciesGroups(data));
  }, []);

  useEffect(() => {
    if (speciesGroups.length) {
      loadMore(uploaded, setUploaded, true);
      loadMore(identified, setIdentified, true);
    }
  }, [filter, speciesGroups]);

  return {
    speciesGroups,
    uploaded: { data: uploaded, loadMore: loadMoreUploaded },
    identified: { data: identified, loadMore: loadMoreIdentified },
    filter,
    setFilter
  };
}
