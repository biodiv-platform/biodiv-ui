import { Spinner } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import GroupCustomField from "@components/pages/group/common/add-custom-field";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import UserGroupEditForm from "./form";
import GroupAdministratorsEditForm from "./group-administrator-edit-form";

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

export default function EditGroupPageComponent({
  speciesGroups,
  customFieldList,
  allCustomField,
  habitats,
  groupInfo,
  founders,
  moderators,
  userGroupId
}: GroupEditPageProps) {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <PageHeading>👥 {t("GROUP.EDIT.TITLE")}</PageHeading>

      {groupInfo ? (
        <UserGroupEditForm
          groupInfo={groupInfo}
          userGroupId={userGroupId}
          habitats={habitats}
          speciesGroups={speciesGroups}
        />
      ) : (
        <Spinner mb={10} />
      )}

      <GroupAdministratorsEditForm
        userGroupId={userGroupId}
        founders={founders}
        moderators={moderators}
      />
      <GroupCustomField
        allCustomField={allCustomField}
        userGroupId={userGroupId}
        groupCustomField={customFieldList}
      />
    </div>
  );
}
