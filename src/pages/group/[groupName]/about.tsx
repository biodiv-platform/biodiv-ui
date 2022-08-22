import { throwUnauthorized } from "@components/auth/auth-redirect";
import AboutGroupComponent from "@components/pages/group/about";
import { axGroupList } from "@services/app.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetGroupAdministratorsByGroupId, axGetUserGroupById } from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

const GroupAboutPage = (props) => <AboutGroupComponent {...props} />;

export const getServerSideProps = async (ctx) => {
  // Will check if user is logged in or redirect

  const aReq = absoluteUrl(ctx);

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitats } = await axGetAllHabitat();

  const { currentGroup } = await axGroupList(aReq.href);

  // This can throw error if user is not authorized
  const { success: s1, data: groupInfo } = await axGetUserGroupById(currentGroup.id);
  const { success: s2, data } = await axGetGroupAdministratorsByGroupId(currentGroup.id);

  if (s1 && s2 && currentGroup?.id) {
    return {
      props: {
        habitats,
        speciesGroups,
        groupInfo: { ...groupInfo, icon: groupInfo.icon || "default" },
        userGroupId: currentGroup.id,
        founders: data.founderList,
        moderators: data.moderatorList
      }
    };
  }

  throwUnauthorized(ctx);
};

export default GroupAboutPage;
