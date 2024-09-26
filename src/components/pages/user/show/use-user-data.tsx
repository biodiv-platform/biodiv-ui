import { MEDIA_TYPES } from "@components/pages/observation/list/filters/media-type/filter-keys";
import useGlobalState from "@hooks/use-global-state";
import { axGetGroupMonthObservedOn, axGetListData, axGetspeciesGroups } from "@services/observation.service";
import { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";

const defaultFilter = {
  sort: "created_on",
  view: "list_minimal"
};

const useUserData = (userId, max = 16) => {
  const { currentGroup } = useGlobalState();
  const [speciesGroups, setSpeciesGroups] = useState<any[]>([]);

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
    hasStats: false,
    link: ""
  });

  const [identifiedObservations, setIdentifiedObservations] = useImmer({
    isLoading: false,
    list: [],
    hasMore: true,
    offset: 0,
    total: 0,
    stats: {},
    speciesData: {},
    hasStats: false,
    link: ""
  });

  const [observationPerMonth, setObservationPerMonth] = useImmer({
    list: [],
    isLoading: true
  });

  const getProcessedFilters = (userKey) => ({
    [userKey]: userId,
    sGroup: filter.sGroupId,
    userGroupList: currentGroup?.id || undefined,
    mediaFilter: filter.hasMedia
      ? MEDIA_TYPES.slice(0, -1)
          .map((t) => t.value)
          .toString()
      : undefined
  });

  const speciesData = useMemo(
    () =>
      speciesGroups.map(({ id, name }) => {
        const uploaded = uploadedObservations.speciesData[name] || 0;
        const identified = identifiedObservations.speciesData[name] || 0;
        const isFilterMatch = filter.sGroupId === id.toString();
        return {
          group: name,
          uploaded: filter.sGroupId ? (isFilterMatch ? uploaded : 0) : uploaded,
          identified: filter.sGroupId ? (isFilterMatch ? identified : 0) : identified
        };
      }),
    [uploadedObservations.speciesData, identifiedObservations.speciesData]
  );

  useEffect(() => {
    axGetspeciesGroups().then(({ data }) => setSpeciesGroups(data));
  }, []);

  const startLoading = (setter, filterParams) => {
    setter((_draft) => {
      _draft.isLoading = true;
      _draft.link = filterParams;
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

      const _speciesData = data?.aggregationData?.groupSpeciesName;
      if (_speciesData) {
        _draft.speciesData = _speciesData;
      }

      _draft.offset = reset ? max : _draft.offset + max;
      _draft.hasStats = true;
      _draft.total = data.totalCount;
    });
  };

  const loadMoreUploadedObservations = async (reset?: boolean) => {
    const filterParams = getProcessedFilters("user");
    startLoading(setUploadedObservations, filterParams);

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      offset: reset ? 0 : uploadedObservations.offset,
      ...filterParams
    });

    if (success) {
      updateObsevationData(setUploadedObservations, data, reset);
    }
  };

  const loadMoreIdentifiedObservations = async (reset?: boolean) => {
    const filterParams = getProcessedFilters("authorVoted");
    startLoading(setIdentifiedObservations, filterParams);

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      offset: reset ? 0 : identifiedObservations.offset,
      ...getProcessedFilters("authorVoted")
    });

    if (success) {
      updateObsevationData(setIdentifiedObservations, data, reset);
    }
  };

  const fetchObservationPerMonth = async (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetGroupMonthObservedOn(userId);

    setter((_draft) => {
      if (success) {
        _draft.list = data;
      }
      _draft.isLoading = false;
    });
  };

  useEffect(() => {
    fetchObservationPerMonth(setObservationPerMonth);
  }, []);

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
    setFilter,
    getProcessedFilters,

    observationPerMonth
  };
};

export default useUserData;
