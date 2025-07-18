import { UserListContextProvider } from "@components/pages/user/common/use-user-filter";
import UserListComponent from "@components/pages/user/list/user-list-data";
import { Role } from "@interfaces/custom";
import { axGroupList } from "@services/app.service";
import { axGetUserList } from "@services/user.service";
import { LIST_PAGINATION_LIMIT } from "@static/documnet-list";
import { DEFAULT_FILTER } from "@static/user";
import { hasAccess } from "@utils/auth";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
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

export const getServerSideProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;
  const aURL = absoluteUrl(ctx).href;
  const isAdmin = hasAccess([Role.Admin], ctx);
  const { currentGroup } = await axGroupList(aURL, getLanguageId(ctx.locale)?.ID);
  const initialFilterParams = { ...ctx.query, ...DEFAULT_FILTER, userGroupList: currentGroup?.groupId };
  const { data } = await axGetUserList(initialFilterParams);

  return {
    props: {
      userListData: {
        l: data.userList,
        ag: data.aggregationData,
        n: data.totalCount,
        hasMore: true
      },
      isAdmin,
      nextOffset,
      initialFilterParams
    }
  };
};

export default UserListPage;
