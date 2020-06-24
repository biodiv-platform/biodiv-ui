import { authorizedPageSSR } from "@components/auth/auth-redirect";
import CreateGroupPage from "@components/pages/group/create";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const createGroup = ({ speciesGroups, habitats }) => (
  <CreateGroupPage habitats={habitats} speciesGroups={speciesGroups} />
);

createGroup.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Admin], ctx, false);
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  return {
    speciesGroups,
    habitats: habitatList.map(({ name, id }) => ({ name, id, value: id }))
  };
};

export default createGroup;
