import { Spinner } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import UserGroupEditForm from "../edit/form";
import AdminImageList from "./admin-image-list";

interface GroupEditPageProps {
  speciesGroups;
  habitats;
  customFieldList;
  allCustomField;
  groupInfo;
  founders;
  moderators;
  userGroupId;
}

export default function AboutGroupComponent({
  speciesGroups,
  habitats,
  groupInfo,
  founders,
  moderators,
  userGroupId
}: GroupEditPageProps) {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <PageHeading>👥 {t("GROUP.ABOUT.TITLE")}</PageHeading>

      {groupInfo ? (
        <UserGroupEditForm
          groupInfo={groupInfo}
          userGroupId={userGroupId}
          habitats={habitats}
          isReadOnly={true}
          speciesGroups={speciesGroups}
        />
      ) : (
        <Spinner mb={10} />
      )}
      <AdminImageList moderators={moderators} founders={founders} />
    </div>
  );
}
