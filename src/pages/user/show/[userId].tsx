import { GroupListFilterProvider } from "@components/pages/group/list/use-group-list";
import UserShowPageComponent from "@components/pages/user/show";
import SITE_CONFIG from "@configs/site-config";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetUserById } from "@services/user.service";
import { axGroupListExpanded } from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const UserShowPage = ({ user, groupFilter, tab }) => (
  <GroupListFilterProvider {...groupFilter}>
    <UserShowPageComponent user={user} tab={tab}/>
  </GroupListFilterProvider>
);

export const getServerSideProps = async (ctx) => {
  const { success, data: user } = await axGetUserById(ctx.query.userId, ctx);
  const [groupListExpanded, speciesGroups, habitat] = await Promise.all([
    axGroupListExpanded(getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID),
    axGetspeciesGroups(),
    axGetAllHabitat()
  ]);

  if (!success) return { notFound: true };

  return {
    props: {
      user,
      groupFilter: {
        userGroupList: groupListExpanded.data,
        speciesGroups: speciesGroups.data,
        habitat: habitat.data,
        userId: user.id
      },
      tab: ctx.query.tab ?? "about",
      success
    }
  };
};

export default UserShowPage;
