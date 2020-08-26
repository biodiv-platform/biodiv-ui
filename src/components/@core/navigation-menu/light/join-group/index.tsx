import { Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useGlobalState from "@hooks/useGlobalState";
import { axJoinUserGroup } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";

export default function JoinUserGroup() {
  const { currentGroup, isCurrentGroupMember } = useGlobalState();
  const [showJoin, setShowJoin] = useState(currentGroup?.id ? isCurrentGroupMember : true);
  const [isLoading, setLoading] = useState<boolean>();
  const { t } = useTranslation();

  const addUserGroupMember = async () => {
    setLoading(true);
    const canAddMember = currentGroup.isParticipatory || confirm(t("GROUP.CONFIRM_CLOSED_GROUP"));
    if (canAddMember) {
      const { success } = await axJoinUserGroup(currentGroup.id);
      if (success) {
        setShowJoin(true);
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

  return showJoin ? null : (
    <Button
      className="join-usergroup"
      size="sm"
      isLoading={isLoading}
      variantColor="blue"
      onClick={addUserGroupMember}
      leftIcon="add"
    >
      {t("GROUP.JOIN")}
    </Button>
  );
}
