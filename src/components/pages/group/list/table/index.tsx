import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import React from "react";

import useGroupListFilter from "../use-group-list";
import { UserGroupListTableRows } from "./group-list-rows";

export default function UserGroupListTable() {
  const { groupListData } = useGroupListFilter();

  return (
    <ResponsiveContainer mb={12}>
      <BasicTable columns={UserGroupListTableRows} data={groupListData} />
    </ResponsiveContainer>
  );
}
