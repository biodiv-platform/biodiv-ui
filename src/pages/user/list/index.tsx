import { UserListContextProvider } from "@components/pages/user/common/use-user-filter";
import UserListComponent from "@components/pages/user/list/user-list-data";
import { Role } from "@interfaces/custom";
import { axGetUserList } from "@services/user.service";
import { axGroupList } from "@services/usergroup.service";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { DEFAULT_FILTER } from "@static/user";
import { hasAccess } from "@utils/auth";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function UserListPage({ userListData, initialFilterParams, isAdmin }) {
  return (
    <UserListContextProvider
      userListData={userListData}
      isAdmin={isAdmin}
      filter={initialFilterParams}
    >
      <UserListComponent />
    </UserListContextProvider>
  );
}
UserListPage.config = {
  footer: false
};

UserListPage.getInitialProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;
  const aURL = absoluteUrl(ctx).href;
  const isAdmin = hasAccess([Role.Admin], ctx);
  const { currentGroup } = await axGroupList(aURL);
  const initialFilterParams = { ...DEFAULT_FILTER, ...ctx.query, userGroupList: currentGroup?.id };
  const { data } = await axGetUserList(initialFilterParams);

  return {
    userListData: {
      l: data.userList,
      ag: data.aggregationData,
      n: data.totalCount,
      hasMore: true
    },
    isAdmin,
    nextOffset,
    initialFilterParams
  };
};

export default UserListPage;