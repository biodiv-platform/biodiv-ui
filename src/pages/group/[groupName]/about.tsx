import { authorizedPageSSR, throwUnauthorized } from "@components/auth/auth-redirect";
import AboutGroupComponent from "@components/pages/group/about";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import {
  axGetGroupAdministratorsByGroupId,
  axGetGroupEditInfoByGroupId,
  axGroupList
} from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

const GroupEditPage = (props) => <AboutGroupComponent {...props} />;

GroupEditPage.getInitialProps = async (ctx) => {
  // Will check if user is logged in or redirect
  authorizedPageSSR([Role.Any], ctx, true);

  const aReq = absoluteUrl(ctx.req);

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();

  const { currentGroup } = await axGroupList(aReq.href);

  // This can throw error if user is not authorized
  const { success: s1, data: groupInfo } = await axGetGroupEditInfoByGroupId(currentGroup.id, ctx);
  const { success: s2, data } = await axGetGroupAdministratorsByGroupId(currentGroup.id, ctx);
  if (s1 && s2) {
    return {
      habitats: habitatList,
      speciesGroups,
      groupInfo: { ...groupInfo, icon: groupInfo.icon || "default" },
      userGroupId: currentGroup.id,
      founders: data.founderList.map((o) => ({
        ...o,
        label: o.label,
        value: o.value
      })),
      moderators: data.moderatorList.map((o) => ({
        ...o,
        label: o.label,
        value: o.value
      }))
    };
  } else {
    throwUnauthorized(ctx);
  }
};

export default GroupEditPage;
