import { authorizedPageSSR, throwUnauthorized } from "@components/auth/auth-redirect";
import GroupEditComponent from "@components/pages/group/edit";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import { axGetGroupEditById } from "@services/usergroup.service";
import React from "react";

const ObservationEditPage = ({ userGroup, userGroupId, habitats, speciesGroups }) => (
  <GroupEditComponent
    userGroup={userGroup}
    speciesGroups={speciesGroups}
    habitats={habitats}
    userGroupId={userGroupId}
  />
);

ObservationEditPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx, true);
  const { success, data } = await axGetGroupEditById(ctx.query.groupId, ctx);
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  if (success) {
    return {
      userGroup: data,
      userGroupId: ctx.query.userGroupId,
      habitats: habitatList,
      speciesGroups
    };
  } else {
    throwUnauthorized(ctx);
  }
};

export default ObservationEditPage;
