import { authorizedPageSSP, throwUnauthorized } from "@components/auth/auth-redirect";
import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { axGroupList } from "@services/app.service";
import { axGetspeciesGroups, axGetTraitsByGroupId } from "@services/observation.service";
import { axGetTaxonDetails } from "@services/taxonomy.service";
import {
  axGetAllCustomFields,
  axGetGroupAdministratorsByGroupId,
  axGetGroupEditInfoByGroupId,
  axGetGroupHompageDetails,
  axGetUserGroupCustomField,
  axGetUserGroupMediaToggle,
  axGetUserGroupRules
} from "@services/usergroup.service";
import { axGetAllHabitat, axGetLangList } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
import dynamic from "next/dynamic";
import React from "react";

const GroupEditPageComponent: any = dynamic(() => import("@components/pages/group/edit"), {
  ssr: false
});

const GroupEditPage = (props) => <GroupEditPageComponent {...props} />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  if (redirect) return redirect;

  const aReq = absoluteUrl(ctx);

  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitats } = await axGetAllHabitat();

  const { currentGroup } = await axGroupList(aReq.href, langId);

  // This can throw error if user is not authorized
  const { data: allCustomField } = await axGetAllCustomFields(ctx);
  const { success: s1, data: groupInfo } = await axGetGroupEditInfoByGroupId(
    currentGroup.groupId,
    ctx
  );
  const { success: s2, data } = await axGetGroupAdministratorsByGroupId(currentGroup.groupId);
  const { success: s4, data: groupRules } = await axGetUserGroupRules(currentGroup.groupId);
  const { success: s3, data: customFieldList } = await axGetUserGroupCustomField(
    currentGroup.groupId
  );
  const { data: homePageDetails } = await axGetGroupHompageDetails(currentGroup.groupId, langId);
  const { success: s5, customisations } = await axGetUserGroupMediaToggle(currentGroup.groupId);
  const { success: s6, data: traits } = await axGetTraitsByGroupId(829, langId);
  const { data: languagesList } = await axGetLangList();
  if (groupRules.taxonomicRuleList?.length) {
    const taxonPromises = groupRules.taxonomicRuleList.map(async (item) => {
      const details = await axGetTaxonDetails(item.taxonomyId);
      return {
        ...item,
        name: details.data.taxonomyDefinition.name
      };
    });
    groupRules.taxonomicRuleList = await Promise.all(taxonPromises);
  }
  if (s1 && s2 && s3 && s4 && s5 && s6) {
    return {
      props: {
        habitats,
        speciesGroups,
        groupInfo,
        customFieldList,
        allCustomField,
        groupRules,
        homePageDetails,
        userGroupId: currentGroup.groupId,
        founders: data.founderList.map(({ name, id }) => ({ label: `${name} (${id})`, value: id })),
        moderators: data.moderatorList.map(({ name, id }) => ({
          label: `${name} (${id})`,
          value: id
        })),
        mediaToggle: customisations.mediaToggle,
        langId,
        traits,
        languagesList
      }
    };
  }

  throwUnauthorized(ctx);
};

export default GroupEditPage;
