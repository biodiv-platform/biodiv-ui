import { UserListContextProvider } from "@components/pages/user/common/use-user-filter";
import UserListComponent from "@components/pages/user/list/user-list-data";
import { axGetUserList } from "@services/user.service";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { DEFAULT_FILTER } from "@static/user";
import React from "react";

function UserListPage({ userListData, initialFilterParams }) {
  return (
    <UserListContextProvider userListData={userListData} filter={initialFilterParams}>
      <UserListComponent />
    </UserListContextProvider>
  );
}
UserListPage.config = {
  footer: false
};

export const getServerSideProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;
  const initialFilterParams = { ...DEFAULT_FILTER, ...ctx.query };
  const { data } = await axGetUserList(initialFilterParams);

  return {
    props: {
      userListData: {
        l: data.userList,
        ag: data.aggregationData,
        n: data.totalCount,
        hasMore: true
      },
      nextOffset,
      initialFilterParams
    }
  };
};

export default UserListPage;
