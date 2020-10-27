import { axGetListData } from "@services/observation.service";
import SpeciesGroup from "@static/species-group";
import { useEffect, useMemo } from "react";
import { useImmer } from "use-immer";

const defaultFilter = {
  sort: "created_on",
  view: "list_minimal"
};

const useUserData = (userId, max = 16) => {
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

  const speciesData = useMemo(
    () =>
      SpeciesGroup.map((k) => ({
        group: k,
        uploaded: uploadedObservations.speciesData[k] || 0,
        identified: identifiedObservations.speciesData[k] || 0
      })),
    [uploadedObservations.speciesData, identifiedObservations.speciesData]
  );

  const startLoading = (setter) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });
  };

  const updateObsevationData = (setter, data, setStats?: boolean) => {
    setter((_draft) => {
      _draft.list.push(...data.observationListMinimal);
      _draft.isLoading = false;

      if (data.observationListMinimal.length !== max) {
        _draft.hasMore = false;
      }

      if (setStats) {
        _draft.speciesData = data?.aggregationData?.groupSpeciesName;
        _draft.offset = _draft.offset + max;
        _draft.hasStats = true;
        _draft.total = data.totalCount;
      }
    });
  };

  const loadMoreUploadedObservations = async (setStats?: boolean) => {
    startLoading(setUploadedObservations);

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      user: userId,
      offset: uploadedObservations.offset
    });

    if (success) {
      updateObsevationData(setUploadedObservations, data, setStats);
    }
  };

  const loadMoreIdentifiedObservations = async (setStats?: boolean) => {
    startLoading(setIdentifiedObservations);

    const { success, data } = await axGetListData({
      ...defaultFilter,
      max,
      authorVoted: userId,
      offset: identifiedObservations.offset
    });

    if (success) {
      updateObsevationData(setIdentifiedObservations, data, setStats);
    }
  };

  useEffect(() => {
    loadMoreUploadedObservations(true);
    loadMoreIdentifiedObservations(true);
  }, []);

  return {
    speciesData,

    uploadedObservations,
    loadMoreUploadedObservations,

    identifiedObservations,
    loadMoreIdentifiedObservations
  };
};

export default useUserData;
