import { Spinner } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import GroupCustomField from "@components/pages/group/common/custom-field";
import useTranslation from "@hooks/use-translation";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import React from "react";

import ContactAdmin from "./contact-admin";
import UserGroupEditForm from "./form";
import GroupAdministratorsEditForm from "./group-administrator-edit-form";
import GroupRules from "./group-rules";
import GroupHomePageCustomization from "./homepage-customization";

interface GroupEditPageProps {
  speciesGroups;
  habitats;
  customFieldList;
  allCustomField;
  groupInfo;
  groupRules;
  founders;
  homePageDetails;
  moderators;
  userGroupId;
}

export default function EditGroupPageComponent({
  speciesGroups,
  customFieldList,
  allCustomField,
  groupRules,
  habitats,
  groupInfo,
  founders,
  moderators,
  homePageDetails,
  userGroupId
}: GroupEditPageProps) {
  const { t } = useTranslation();
  const isAdmin = hasAccess([Role.Admin]);

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
      {isAdmin ? (
        <div>
          <GroupCustomField
            allCustomField={allCustomField}
            userGroupId={userGroupId}
            groupCustomField={customFieldList}
          />
          <GroupRules rules={groupRules} userGroupId={userGroupId} />
          <GroupHomePageCustomization userGroupId={userGroupId} homePageDetails={homePageDetails} />
        </div>
      ) : (
        <ContactAdmin />
      )}
    </div>
  );
}
