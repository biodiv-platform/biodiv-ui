import { Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axCheckUserGroupMember, axJoinOpenUserGroup } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

export default function JoinUserGroup() {
  const { currentGroup, user } = useStoreState((s) => s);
  const [isMember, setIsMember] = useState(false);
  const { t } = useTranslation();

  const addUserGroupMember = async () => {
    const canAddMember = !currentGroup.isParticipatory
      ? confirm(t("GROUP.CONFIRM_CLOSED_GROUP"))
      : true;
    if (canAddMember) {
      const { success } = await axJoinOpenUserGroup(currentGroup.id);
      if (success) {
        setIsMember(true);
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
    (async () => {
      const { data } = await axCheckUserGroupMember(currentGroup.id, user.id);
      setIsMember(data);
    })();
  }, [currentGroup.name]);

  return !isMember ? (
    <Button variant="outline" variantColor="black" onClick={addUserGroupMember}>
      {t("GROUP.JOIN")}{" "}
    </Button>
  ) : null;
}
