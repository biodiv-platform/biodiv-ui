import CreateGroupPage from "../../../components/pages/group/createGroupPage";
import { axGetLangList } from "@services/utility.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import { hasAccess } from "@utils/auth";
import { encode } from "base64-url";
import { Role } from "@interfaces/custom";
import React from "react";

function createGroup({ speciesGroups, habitats }) {
  return <CreateGroupPage habitats={habitats} speciesGroups={speciesGroups} />;
}

export async function getServerSideProps(ctx) {
  if (!hasAccess([Role.Admin, Role.User], ctx)) {
    const Location = `/login?forward=${encode("/group/create")}`;
    ctx.res.writeHead(302, {
      Location,
      "Content-Type": "text/html; charset=utf-8"
    });
    ctx.res.end();
  }
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
