import { MEDIA_TYPES } from "@components/pages/observation/list/filters/media-type/filter-keys";
import useGlobalState from "@hooks/use-global-state";
import { axGetListData, axGetspeciesGroups } from "@services/observation.service";
import SpeciesGroup from "@static/species-group";
import { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";

const defaultFilter = {
  sort: "created_on",
  view: "list_minimal"
};

const useUserData = (userId, max = 16) => {
  const { currentGroup } = useGlobalState();
  const [speciesGroups, setSpeciesGroups] = useState([]);

  const [filter, setFilter] = useState<{ sGroupId; hasMedia }>({
    sGroupId: undefined,
    hasMedia: true
  });

  const [uploadedObservations, setUploadedObservations] = useImmer({
    isLoading: false,
    list: [],
    hasMore: true,
    offset: 0,
    total: 0,
    stats: {},
    speciesData: {},
    hasStats: false
  });

  const [identifiedObservations, setIdentifiedObservations] = useImmer({
    isLoading: false,
    list: [],
    hasMore: true,
    offset: 0,
    total: 0,
    stats: {},
    speciesData: {},
    hasStats: false
  });

  const getProcessedFilters = () => ({
    sGroup: filter.sGroupId,
    mediaFilter: filter.hasMedia
      ? MEDIA_TYPES.slice(0, -1)
          .map((t) => t.value)
          .toString()
      : undefined
  });

  const speciesData = useMemo(
    () =>
      SpeciesGroup.map((k) => ({
        group: k,
        uploaded: uploadedObservations.speciesData[k] || 0,
        identified: identifiedObservations.speciesData[k] || 0
      })),
    [uploadedObservations.speciesData, identifiedObservations.speciesData]
  );

  useEffect(() => {
    axGetspeciesGroups().then(({ data }) => setSpeciesGroups(data));
  }, []);

  const startLoading = (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });
  };

  const updateObsevationData = (setter, data, reset?: boolean) => {
    setter((_draft) => {
      if (reset) {
        _draft.list = [];
        _draft.hasMore = true;
      }

      _draft.list.push(...data.observationListMinimal);
      _draft.isLoading = false;

      if (data.observationListMinimal.length !== max) {
        _draft.hasMore = false;
      }

      _draft.speciesData = data?.aggregationData?.groupSpeciesName;
      _draft.offset = reset ? max : _draft.offset + max;
      _draft.hasStats = true;
      _draft.total = data.totalCount;
    });
  };

  const loadMoreUploadedObservations = async (reset?: boolean) => {
    startLoading(setUploadedObservations);

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      user: userId,
      offset: reset ? 0 : uploadedObservations.offset,
      userGroupList: currentGroup?.id || undefined,
      ...getProcessedFilters()
    });

    if (success) {
      updateObsevationData(setUploadedObservations, data, reset);
    }
  };

  const loadMoreIdentifiedObservations = async (reset?: boolean) => {
    startLoading(setIdentifiedObservations);

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      authorVoted: userId,
      offset: reset ? 0 : identifiedObservations.offset,
      userGroupList: currentGroup?.id || undefined,
      ...getProcessedFilters()
    });

    if (success) {
      updateObsevationData(setIdentifiedObservations, data, reset);
    }
  };

  useEffect(() => {
    if (speciesGroups.length) {
      loadMoreUploadedObservations(true);
      loadMoreIdentifiedObservations(true);
    }
  }, [speciesGroups, filter]);

  return {
    speciesData,

    uploadedObservations,
    loadMoreUploadedObservations,

    identifiedObservations,
    loadMoreIdentifiedObservations,

    speciesGroups,
    filter,
    setFilter
  };
};

export default useUserData;
