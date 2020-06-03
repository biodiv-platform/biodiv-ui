import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import UserGroupEditForm from "./userEditForm";
import React from "react";

export default function GroupEditComponent({ userGroup, userGroupId, habitats, speciesGroups }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="container mt">
        <PageHeading>{t("OBSERVATION.TITLE_EDIT")}</PageHeading>
        <UserGroupEditForm
          userGroup={userGroup}
          userGroupId={userGroupId}
          habitats={habitats}
          speciesGroups={speciesGroups}
        />
      </div>
    </>
  );
}
