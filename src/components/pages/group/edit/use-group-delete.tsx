import { axGetObservationMapData } from "@services/observation.service";

export const useGroupDelete = () => {
  const axUnpostUserGroupObservations = async (userGroupId) => {
    const params = {
      selectAll: "true",
      view: "bulkMapping",
      sort: "created_on",
      bulkObservationIds: "",
      bulkUsergroupIds: userGroupId,
      bulkAction: "ugBulkUnPosting",
      userGroupList: userGroupId
    };

    const { success, data } = await axGetObservationMapData(params, {}, true);
    return {
      success,
      data
    };
  };
  return {
    axUnpostUserGroupObservations
  };
};
