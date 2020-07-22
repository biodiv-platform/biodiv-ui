import { authorizedPageSSR, throwUnauthorized } from "@components/auth/auth-redirect";
import GroupEditPageComponent from "@components/pages/group/edit";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import {
  axGetAllCustomFields,
  axGetGroupAdministratorsByGroupId,
  axGetGroupEditInfoByGroupId,
  axGetGroupHompageDetails,
  axGetUserGroupCustomField,
  axGetUserGroupRules,
  axGroupList
} from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

const GroupEditPage = (props) => <GroupEditPageComponent {...props} />;

GroupEditPage.getInitialProps = async (ctx) => {
  // Will check if user is logged in or redirect
  authorizedPageSSR([Role.Any], ctx, true);

  const aReq = absoluteUrl(ctx.req);

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitats } = await axGetAllHabitat();

  const { currentGroup } = await axGroupList(aReq.href);

  // This can throw error if user is not authorized
  const { data: allCustomField } = await axGetAllCustomFields(ctx);
  const { success: s1, data: groupInfo } = await axGetGroupEditInfoByGroupId(currentGroup.id, ctx);
  const { success: s2, data } = await axGetGroupAdministratorsByGroupId(currentGroup.id);
  const { success: s4, data: groupRules } = await axGetUserGroupRules(currentGroup.id, ctx);
  const { success: s3, data: customFieldList } = await axGetUserGroupCustomField(
    currentGroup.id,
    ctx
  );
  const { data: homePageDetails } = await axGetGroupHompageDetails(currentGroup.id);
  if (s1 && s2 && s3 && s4) {
    return {
      habitats,
      speciesGroups,
      groupInfo,
      customFieldList,
      allCustomField,
      groupRules,
      homePageDetails,
      userGroupId: currentGroup.id,
      founders: data.founderList.map(({ name: label, id: value }) => ({ label, value })),
      moderators: data.moderatorList.map(({ name: label, id: value }) => ({ label, value }))
    };
  }

  throwUnauthorized(ctx);
};

export default GroupEditPage;
