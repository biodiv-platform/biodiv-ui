import { Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axCheckUserGroupMember, axJoinUserGroup } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

export default function JoinUserGroup() {
  const { currentGroup, user } = useStoreState((s) => s);
  const [isMember, setIsMember] = useState<boolean | null>(true);
  const { t } = useTranslation();

  const addUserGroupMember = async () => {
    const canAddMember = currentGroup.isParticipatory || confirm(t("GROUP.CONFIRM_CLOSED_GROUP"));
    if (canAddMember) {
      const { success } = await axJoinUserGroup(currentGroup.id);
      if (success) {
        setIsMember(success);
        notification(
          currentGroup.isParticipatory ? t("GROUP.MEMBER_JOINED") : t("GROUP.MEMBER_REQUESTED"),
          NotificationType.Success
        );
      } else {
        notification(t("MEMBER_JOINED_ERROR"), NotificationType.Error);
      }
    }
  };

  useEffect(() => {
    axCheckUserGroupMember(currentGroup.id, user.id).then(({ data }) => {
      setIsMember(data);
    });
  }, [currentGroup.name]);

  return isMember ? null : (
    <Button
      variant="solid"
      size="sm"
      ml={{ base: 0, md: 4 }}
      variantColor="blue"
      onClick={addUserGroupMember}
      leftIcon="add"
    >
      {t("GROUP.JOIN")}
    </Button>
  );
}
