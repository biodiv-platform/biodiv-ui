import { GroupListFilterProvider } from "@components/pages/group/list/use-group-list";
import UserShowPageComponent from "@components/pages/user/show";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetUserById } from "@services/user.service";
import { axGroupListExpanded } from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const UserShowPage = ({ user, groupFilter }) => (
  <GroupListFilterProvider {...groupFilter}>
    <UserShowPageComponent user={user} />
  </GroupListFilterProvider>
);

export const getServerSideProps = async (ctx) => {
  const { success, data: user } = await axGetUserById(ctx.query.userId, ctx);
  const [groupListExpanded, speciesGroups, habitat] = await Promise.all([
    axGroupListExpanded(),
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
      success
    }
  };
};

export default UserShowPage;
