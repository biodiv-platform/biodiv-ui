import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";

import GroupListFilters from "./filters";
import UserGroupListTable from "./table";

export default function GroupListPageComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <PageHeading>👥 {t("group:list.title")}</PageHeading>
      <GroupListFilters />
      <UserGroupListTable />
    </div>
  );
}
