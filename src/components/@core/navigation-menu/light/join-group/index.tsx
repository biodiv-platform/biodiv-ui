import { Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axCheckUserGroupMember, axJoinUserGroup } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

export default function JoinUserGroup() {
  const { currentGroup, user } = useStoreState((s) => s);
  const [isMember, setIsMember] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>();
  const { t } = useTranslation();

  const addUserGroupMember = async () => {
    setLoading(true);
    const canAddMember = currentGroup.isParticipatory || confirm(t("GROUP.CONFIRM_CLOSED_GROUP"));
    if (canAddMember) {
      const { success } = await axJoinUserGroup(currentGroup.id);
      if (success) {
        setIsMember(true);
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

  useEffect(() => {
    axCheckUserGroupMember(currentGroup.id, user.id).then(({ data }) => setIsMember(data));
  }, [currentGroup.name]);

  return isMember ? null : (
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
