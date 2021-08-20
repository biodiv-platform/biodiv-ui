import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import { UserGroupListTableRows } from "@components/pages/group/list/table/group-list-rows";
import useGroupListFilter from "@components/pages/group/list/use-group-list";
import React, { useMemo } from "react";

export default function UserGroupListTab() {
  const { groupListData, groupJoinedStatus } = useGroupListFilter();

  const groupUserFilterData = useMemo(() => {
    return groupListData.filter((item) => !!groupJoinedStatus[item.id]);
  }, [groupJoinedStatus]);

  return (
    <ResponsiveContainer mb={12}>
      <BasicTable columns={UserGroupListTableRows} data={groupUserFilterData} />
    </ResponsiveContainer>
  );
}
