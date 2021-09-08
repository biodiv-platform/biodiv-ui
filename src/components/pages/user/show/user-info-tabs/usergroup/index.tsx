import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import { UserGroupListTableRows } from "@components/pages/group/list/table/group-list-rows";
import useGroupListFilter from "@components/pages/group/list/use-group-list";
import useGlobalState from "@hooks/use-global-state";
import React, { useMemo } from "react";

export default function UserGroupListTab() {
  const { groupListData, groupJoinedStatus, userId } = useGroupListFilter();
  const { user } = useGlobalState();

  const groupUserFilterData = useMemo(() => {
    return groupListData.filter((item) => !!groupJoinedStatus[item.id]);
  }, [groupJoinedStatus]);

  const columns = useMemo(() => {
    return UserGroupListTableRows.filter((col) => {
      return user.id !== userId ? !col.authorOnly && !col.listOnly : !col.listOnly;
    });
  }, []);

  return (
    <ResponsiveContainer mb={12}>
      <BasicTable columns={columns} data={groupUserFilterData} />
    </ResponsiveContainer>
  );
}
