import { HStack, Spinner } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import { PageHeading } from "@components/@core/layout";
import GroupCustomField from "@components/pages/group/common/custom-field";
import { Role } from "@interfaces/custom";
import { axDeleteUserGroup } from "@services/usergroup.service";
import { hasAccess } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
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
      <HStack justifyContent="space-between">
        <PageHeading>👥 {t("group:edit.title")}</PageHeading>
        <DeleteActionButton
          observationId={userGroupId}
          deleteFunc={axDeleteUserGroup}
          deleted="successfully deleted"
          title="Delete usergroup"
          description="Are you sure? you can't undo this  action"
          deleteUserGroup={true}
        />
      </HStack>
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
      <GroupHomePageCustomization userGroupId={userGroupId} homePageDetails={homePageDetails} />
      {isAdmin ? (
        <div>
          <GroupCustomField
            allCustomField={allCustomField}
            userGroupId={userGroupId}
            groupCustomField={customFieldList}
          />
          <GroupRules rules={groupRules} userGroupId={userGroupId} />
        </div>
      ) : (
        <ContactAdmin />
      )}
    </div>
  );
}
