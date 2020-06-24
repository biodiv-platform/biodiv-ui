import { authorizedPageSSR } from "@components/auth/auth-redirect";
import GroupEditPageComponent from "@components/pages/group/edit";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const GroupEditPage = ({ habitats, speciesGroups }) => (
  <GroupEditPageComponent speciesGroups={speciesGroups} habitats={habitats} />
);

GroupEditPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Admin], ctx, false);
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  return {
    habitats: habitatList,
    speciesGroups
  };
};

export default GroupEditPage;
