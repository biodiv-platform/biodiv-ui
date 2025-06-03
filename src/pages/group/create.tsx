import { authorizedPageSSR } from "@components/auth/auth-redirect";
import CreateGroupPage from "@components/pages/group/create";
import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups, axGetTraitsByGroupId } from "@services/observation.service";
import { axGetAllCustomFields } from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const createGroup = ({ speciesGroups, habitats, allCustomField, traits }) => (
  <CreateGroupPage
    habitats={habitats}
    speciesGroups={speciesGroups}
    allCustomField={allCustomField}
    traits={traits}
  />
);

createGroup.getInitialProps = async (ctx) => {
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  authorizedPageSSR([Role.Admin], ctx, false);
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  const { data: allCustomField } = await axGetAllCustomFields(ctx);
  const { data: traits } = await axGetTraitsByGroupId(829, langId);
  return {
    speciesGroups,
    habitats: habitatList.map(({ name, id }) => ({ name, id, value: id })),
    allCustomField,
    traits
  };
};

export default createGroup;
