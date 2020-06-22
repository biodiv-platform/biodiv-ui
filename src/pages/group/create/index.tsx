import { authorizedPageSSR } from "@components/auth/auth-redirect";
import CreateGroupPage from "@components/pages/group/createGroupPage";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const createGroup = ({ speciesGroups, habitats }) => (
  <CreateGroupPage habitats={habitats} speciesGroups={speciesGroups} />
);

createGroup.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Admin], ctx, !hasAccess([Role.Admin, Role.User], ctx));
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  return {
    speciesGroups,
    habitats: habitatList.map((item) => ({ label: item.name, value: item.id, id: item.id }))
  };
};

export default createGroup;
