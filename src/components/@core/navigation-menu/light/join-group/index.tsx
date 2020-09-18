import { Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useGlobalState from "@hooks/useGlobalState";
import AddIcon from "@icons/add";
import { axJoinUserGroup } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";

export default function JoinUserGroup() {
  const {
    isLoggedIn,
    currentGroup,
    isCurrentGroupMember,
    setIsCurrentGroupMember
  } = useGlobalState();
  const [isLoading, setLoading] = useState<boolean>();
  const { t } = useTranslation();

  const addUserGroupMember = async () => {
    setLoading(true);
    const canAddMember = currentGroup.isParticipatory || confirm(t("GROUP.CONFIRM_CLOSED_GROUP"));
    if (canAddMember) {
      const { success } = await axJoinUserGroup(currentGroup.id);
      if (success) {
        setIsCurrentGroupMember(true);
        notification(
          currentGroup.isParticipatory ? t("GROUP.MEMBER.JOINED") : t("GROUP.MEMBER.REQUESTED"),
          NotificationType.Success
        );
      } else {
        notification(t("GROUP.MEMBER.JOINED_ERROR"), NotificationType.Error);
      }
    }
    setLoading(false);
  };

  return isCurrentGroupMember || !isLoggedIn ? null : (
    <Button
      className="join-usergroup"
      size="sm"
      isLoading={isLoading}
      colorScheme="blue"
      onClick={addUserGroupMember}
      leftIcon={<AddIcon />}
    >
      {t("GROUP.JOIN")}
    </Button>
  );
}
