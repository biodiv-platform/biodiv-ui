import ObservationLoading from "@components/pages/common/loading";
import useUserListFilter from "@components/pages/user/common/use-user-filter";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import { axCheckUserGroupFounderOrAdmin } from "@services/usergroup.service";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import GridViewCard from "./card";

const GridViewBox = styled.div`
  .grid-card {
    margin-top: 2px;
    display: grid;
    grid-gap: 1.25rem;
    margin-bottom: 1rem;

    @media (min-width: 1441px) {
      grid-template-columns: repeat(5, 1fr);
    }

    @media (max-width: 1440px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export default function GridView() {
  const { userListData, getCheckboxProps, nextPage } = useUserListFilter();
  const {
    currentGroup: { id }
  } = useGlobalState();
  const { pathname } = useRouter();
  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {
    if (id) {
      axCheckUserGroupFounderOrAdmin(id).then((data) => {
        setCanEdit(data && !pathname.endsWith("edit"));
      });
    }
  }, [pathname]);

  return userListData && Array.isArray(userListData.l) ? (
    <GridViewBox className="view_list_minimal">
      <InfiniteScroll
        dataLength={userListData?.l?.length}
        next={nextPage}
        hasMore={userListData?.l?.length > 0 && userListData.hasMore}
        loader={<ObservationLoading key={0} />}
        scrollableTarget="items-container"
      >
        <div className="grid-card">
          {userListData?.l?.map((user) => (
            <GridViewCard
              key={user?.id}
              user={user}
              canEdit={canEdit}
              getCheckboxProps={getCheckboxProps}
            />
          ))}
        </div>
      </InfiniteScroll>
    </GridViewBox>
  ) : (
    <p>Users Not Found</p>
  );
}
