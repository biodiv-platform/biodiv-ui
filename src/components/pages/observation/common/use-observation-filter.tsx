import { useCheckboxGroup, useDisclosure } from "@chakra-ui/react";
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import useGlobalState from "@hooks/use-global-state";
import { ObservationData, ObservationFilterProps } from "@interfaces/custom";
import { SpeciesGroup } from "@interfaces/esmodule";
import { UserGroup, UserGroupIbp } from "@interfaces/observation";
import {
  axGetCropResources,
  axGetListData,
  axGetMaxVotedRecoPermissions
} from "@services/observation.service";
import { axGetUserGroupList, getAuthorizedUserGroupById } from "@services/usergroup.service";
import { isBrowser } from "@static/constants";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { stringify } from "@utils/query-string";
import NProgress from "nprogress";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

const deDupeObservations = (existingObservations, newObservations) => {
  const existingIDs = existingObservations.map(({ observationId }) => observationId);
  return newObservations?.filter(({ observationId }) => !existingIDs.includes(observationId));
};

interface ObservationFilterContextProps {
  filter?: ObservationFilterProps;
  observationData: ObservationData;
  location;
  setObservationData?;
  totalCount?;
  getCheckboxProps?;
  observationListAdd?;
  setFilter?;
  addFilter?;
  removeFilter?;
  children?;
  nextPage?;
  resetFilter?;
  speciesGroup?: SpeciesGroup[];
  userGroup?: UserGroup[];
  authorizedUserGroupList?: UserGroup[];
  hasUgAccess?: boolean;
  states?: string[];
  selectAll?: boolean;
  setSelectAll?;
  bulkObservationIds?: any[];
  handleBulkCheckbox: (arg: string) => void;
  isOpen?;
  onOpen?;
  onClose?;
  traits?;
  customFields?;
  loggedInUserGroups?: UserGroupIbp[];
  cropObservationData;
  setCropObservationData;
  setCropObservationId;
  canCropObservation;
  allMedia;
  setAllMedia;
  addMediaToggle;
}

const ObservationFilterContext = createContext<ObservationFilterContextProps>(
  {} as ObservationFilterContextProps
);

export const ObservationFilterProvider = (props: ObservationFilterContextProps) => {
  const initialOffset = props?.filter?.offset || 0;
  const [filter, setFilter] = useImmer<{ f: any }>({ f: props.filter });
  const [observationData, setObservationData] = useImmer<ObservationData>(props.observationData);
  const { isLoggedIn } = useGlobalState();
  const [loggedInUserGroups, setLoggedInUserGroups] = useState<any[]>([]);
  const [hasUgAccess, setHasUgAdminAccess] = useState<boolean>(false);
  const [authorizedUserGroupList, setAuthorizedUserGroupList] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cropObservationData, setCropObservationData] = useState();
  const [canCropObservation, setCanCropObservation] = useState();
  const [allMedia, setAllMedia] = useState(false);

  const setCropObservationId = async (id, canCrop) => {
    setCanCropObservation(canCrop);

    const response = await axGetCropResources(id);
    setCropObservationData(response.data);
  };

  const { getCheckboxProps, value: bulkObservationIds, setValue } = useCheckboxGroup();

  const handleBulkCheckbox = (actionType: string) => {
    switch (actionType) {
      case "selectAll":
        setSelectAll(true);
        setValue(observationData?.l?.map((i) => String(i.observationId)));
        break;
      case "UnsSelectAll":
        setValue([]);
        setSelectAll(false);
        break;
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      axGetUserGroupList().then(({ data }) => setLoggedInUserGroups(data));
      getAuthorizedUserGroupById().then(({ data }) => {
        setHasUgAdminAccess(data?.isAdmin || false);
        setAuthorizedUserGroupList(data?.ugList || []);
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isBrowser) {
      window.history.pushState("", "", `?${stringify({ ...filter.f, offset: initialOffset })}`);
    }
  }, [filter]);

  const updateMaxVotedRecoPermissions = async (observationList) => {
    if (isLoggedIn) {
      const payload = observationList.reduce((acc, cv) => {
        const taxonId = cv?.recoShow?.recoIbp?.taxonId;
        return taxonId ? { ...acc, [cv.observationId]: taxonId } : acc;
      }, {});
      const mvp = await axGetMaxVotedRecoPermissions(payload);
      setObservationData((_draft: any) => {
        _draft.mvp = { ..._draft.mvp, ...mvp.data };
      });
    }
  };

  useEffect(() => {
    updateMaxVotedRecoPermissions(observationData?.l);
  }, [isLoggedIn]);

  const fetchListData = async () => {
    try {
      NProgress.start();

      // Reset list data if params are changed
      if (filter.f?.offset === 0) {
        setObservationData((_draft) => {
          _draft.l = [];
          _draft.n = -1;
          _draft.ml = [];
        });
      }
      const { location, ...otherValues } = filter.f;
      const { data } = await axGetListData(
        { ...otherValues },
        props.location ? { location: props.location } : location ? { location } : {}
      );
      updateMaxVotedRecoPermissions(data?.observationList);
      setObservationData((_draft) => {
        if (data?.geohashAggregation) {
          _draft.l = data?.geohashAggregation;
        } else if (data.observationList?.length) {
          _draft?.l?.push(...deDupeObservations(_draft.l, data.observationList));
          _draft.hasMore = data.observationList?.length === Number(filter.f.max);
        } else {
          _draft?.ml?.push(...deDupeObservations(_draft.ml, data.observationListMinimal));
          _draft.hasMore = data?.observationListMinimal?.length === Number(filter.f.max);
        }
        _draft.n = data.totalCount;
        if (data?.aggregationData) {
          _draft.ag = data.aggregationData;
        }
      });
      NProgress.done();
    } catch (e) {
      console.error(e);
      NProgress.done();
    }
  };

  useDidUpdateEffect(() => {
    fetchListData();
  }, [filter]);

  useDidUpdateEffect(() => {
    if (selectAll) {
      handleBulkCheckbox("selectAll");
    }
  }, [observationData.l]);

  const addFilter = (key, value) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f[key] = value;
    });
  };

  const removeFilter = (key) => {
    setFilter((_draft) => {
      delete _draft.f[key];
    });
  };

  const nextPage = (max = LIST_PAGINATION_LIMIT) => {
    if (selectAll) {
      handleBulkCheckbox("selectAll");
    }
    setFilter((_draft) => {
      _draft.f.offset = Number(_draft.f.offset) + max;
    });
  };

  const resetFilter = () => {
    setFilter((_draft) => {
      _draft.f = DEFAULT_FILTER;
    });
  };

  const observationListAdd = (items) => {
    setObservationData((_draft) => {
      _draft.l.push(...items);
    });
  };

  const addMediaToggle = (e) => {
    if (e.target.checked) {
      setAllMedia(true);
      addFilter("mediaFilter", "no_of_images,no_of_videos,no_of_audio,no_media");
    } else {
      setAllMedia(false);
      addFilter("mediaFilter", "no_of_images,no_of_videos,no_of_audio");
    }
  };

  return (
    <ObservationFilterContext.Provider
      value={{
        filter: filter.f,
        observationData,
        setObservationData,
        observationListAdd,
        setFilter,
        addFilter,
        removeFilter,
        nextPage,
        resetFilter,
        loggedInUserGroups,
        getCheckboxProps,
        selectAll,
        setSelectAll,
        bulkObservationIds,
        handleBulkCheckbox,
        authorizedUserGroupList,
        hasUgAccess,
        isOpen,
        onOpen,
        onClose,
        // Crop observation data
        cropObservationData,
        setCropObservationData,
        setCropObservationId,
        canCropObservation,
        // Config Properties
        speciesGroup: props.speciesGroup,
        userGroup: props.userGroup,
        location: props.location,
        states: props.states,
        traits: props.traits,
        customFields: props.customFields,
        allMedia,
        setAllMedia,
        addMediaToggle
      }}
    >
      {props.children}
    </ObservationFilterContext.Provider>
  );
};

export default function useObservationFilter() {
  return useContext(ObservationFilterContext);
}
