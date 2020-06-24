import { Spinner } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import {
  axGetGroupAdministratorsByGroupId,
  axGetGroupEditInfoByGroupId
} from "@services/usergroup.service";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

import UserGroupEditForm from "./form";
import GroupAdministratorsEditForm from "./group-administrator-edit-form";

interface GroupEditPageProps {
  speciesGroups;
  habitats;
}

export default function EditGroupPageComponent({ speciesGroups, habitats }: GroupEditPageProps) {
  const { t } = useTranslation();
  const { id } = useStoreState((s) => s.currentGroup);
  const [groupInfo, setGroupInfo] = useState();
  const [groupAdministrators, setGroupAdministrators] = useState<{ founders; moderators }>();

  const getGroupInfo = async () => {
    const { success: s1, data: groupInfo } = await axGetGroupEditInfoByGroupId(id);
    const { success: s2, data } = await axGetGroupAdministratorsByGroupId(id);
    if (s1 && s2) {
      setGroupInfo(groupInfo);
      setGroupAdministrators({
        founders: data.founderList.map(({ name, id }) => ({
          label: name,
          value: id
        })),
        moderators: data.moderatorList.map(({ name, id }) => ({
          label: name,
          value: id
        }))
      });
    }
  };

  useEffect(() => {
    getGroupInfo();
  }, []);

  return (
    <div className="container mt">
      <PageHeading>👥 {t("GROUP.EDIT.TITLE")}</PageHeading>

      {groupInfo ? (
        <UserGroupEditForm
          groupInfo={groupInfo}
          userGroupId={id}
          habitats={habitats}
          speciesGroups={speciesGroups}
        />
      ) : (
        <Spinner mb={10} />
      )}

      {groupAdministrators && (
        <GroupAdministratorsEditForm userGroupId={id} {...groupAdministrators} />
      )}
    </div>
  );
}
