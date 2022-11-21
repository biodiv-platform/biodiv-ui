import { Input } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import { UserGroupListTableRows } from "@components/pages/group/list/table/group-list-rows";
import useGroupListFilter from "@components/pages/group/list/use-group-list";
import useGlobalState from "@hooks/use-global-state";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";

export default function UserGroupListTab() {
  const { groupListData, groupJoinedStatus, userId } = useGroupListFilter();
  const { user } = useGlobalState();
  const [filterGroups, setFilterGroups] = useState<any>(groupListData);
  const { t } = useTranslation();

  const groupUserFilterData = useMemo(() => {
    return groupListData.filter((item) => !!groupJoinedStatus[item.id]);
  }, [groupJoinedStatus]);

  const columns = useMemo(() => {
    return UserGroupListTableRows.filter((col) => {
      return user.id !== userId ? !col.authorOnly && !col.listOnly : !col.listOnly;
    });
  }, []);

  const onQuery = debounce((e) => {
    setFilterGroups(
      groupUserFilterData?.filter((i) => i.name?.toLowerCase().match(e.target.value.toLowerCase()))
    );
  }, 200);

  return (
    <>
      <Input mb={12} onChange={onQuery} placeholder={t("header:search")} />
      <ResponsiveContainer mb={12}>
        <BasicTable columns={columns} data={filterGroups} />
      </ResponsiveContainer>
    </>
  );
}
