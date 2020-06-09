import CreateGroupPage from "../../../components/pages/group/createGroupPage";
import { axGetLangList } from "@services/utility.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import { authorizedPageSSR } from "@components/auth/auth-redirect";
import { Role } from "@interfaces/custom";
import React from "react";

function createGroup({ speciesGroups, habitats }) {
  return <CreateGroupPage habitats={habitats} speciesGroups={speciesGroups} />;
}

export async function getServerSideProps(ctx) {
  authorizedPageSSR([Role.Admin], ctx, true);
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  const { data } = await axGetLangList();
  return {
    props: {
      speciesGroups,
      languages: data.map((l) => ({ label: l.name, value: l.id })),
      habitats: habitatList.map((item) => ({ label: item.name, value: item.id, id: item.id }))
    }
  };
}

export default createGroup;
