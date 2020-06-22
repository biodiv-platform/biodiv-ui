import { authorizedPageSSR } from "@components/auth/auth-redirect";
import GroupEditComponent from "@components/pages/group/edit";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const UserGroupEditPage = ({ habitats, speciesGroups }) => (
  <GroupEditComponent speciesGroups={speciesGroups} habitats={habitats} />
);

UserGroupEditPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Admin], ctx, !hasAccess([Role.Admin, Role.User], ctx));
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  return {
    habitats: habitatList,
    speciesGroups
  };
};

export default UserGroupEditPage;
