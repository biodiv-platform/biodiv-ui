import { Input } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import useGroupListFilter from "../use-group-list";
import { UserGroupListTableRows } from "./group-list-rows";

export default function UserGroupListTable() {
  const { groupListData } = useGroupListFilter();
  const [filterGroups, setFilterGroups] = useState<any>(groupListData);
  const { t } = useTranslation();

  const onQuery = debounce((e) => {
    setFilterGroups(
      groupListData?.filter((i) => i.name?.toLowerCase().match(e.target.value.toLowerCase()))
    );
  }, 200);

  useEffect(() =>{
    setFilterGroups(groupListData)
  }, [groupListData])

  return (
    <>
      <Input mb={12} onChange={onQuery} placeholder={t("header:search")} />
      <ResponsiveContainer mb={12}>
        <BasicTable columns={UserGroupListTableRows} data={filterGroups} />
      </ResponsiveContainer>
    </>
  );
}
