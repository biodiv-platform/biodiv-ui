import { throwUnauthorized } from "@components/auth/auth-redirect";
import AboutGroupComponent from "@components/pages/group/about";
import SITE_CONFIG from "@configs/site-config";
import { axGroupList } from "@services/app.service";
import { axGetspeciesGroups, axGetTraitsByGroupId } from "@services/observation.service";
import { axGetTaxonDetails } from "@services/taxonomy.service";
import {
  axGetGroupAdministratorsByGroupId,
  axGetUserGroupById,
  axGetUserGroupCustomField,
  axGetUserGroupRules
} from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const GroupAboutPage = (props) => <AboutGroupComponent {...props} />;

export const getServerSideProps = async (ctx) => {
  // Will check if user is logged in or redirect

  const aReq = absoluteUrl(ctx);

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitats } = await axGetAllHabitat();

  const { currentGroup } = await axGroupList(
    aReq.href,
    getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID
  );

  // This can throw error if user is not authorized
  const { success: s1, data: groupInfo } = await axGetUserGroupById(currentGroup.groupId);
  const { success: s2, data } = await axGetGroupAdministratorsByGroupId(currentGroup.groupId);
  const { success: s4, data: groupRules } = await axGetUserGroupRules(currentGroup.groupId, ctx);
  const { success: s3, data: customFieldList } = await axGetUserGroupCustomField(
    currentGroup.groupId,
    ctx
  );
  if (groupRules.taxonomicRuleList?.length) {
    const taxonPromises = groupRules.taxonomicRuleList.map(async (item) => {
      const details = await axGetTaxonDetails(item.taxonomyId);
      return {
        ...item,
        name: details.data.taxonomyDefinition.name,
        status: details.data.taxonomyDefinition.status,
        position: details.data.taxonomyDefinition.position
      };
    });
    groupRules.taxonomicRuleList = await Promise.all(taxonPromises);
  }
  const { success: s5, data: traits } = await axGetTraitsByGroupId(
    829,
    getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID
  );

  if (s1 && s2 && s3 && s4 && s5 && currentGroup?.groupId) {
    return {
      props: {
        habitats,
        speciesGroups,
        groupInfo: { ...groupInfo, icon: groupInfo.icon || "default" },
        userGroupId: currentGroup.groupId,
        founders: data.founderList,
        moderators: data.moderatorList,
        groupRules,
        customFieldList,
        traits
      }
    };
  }

  throwUnauthorized(ctx);
};

export default GroupAboutPage;
