import { Button } from "@chakra-ui/react";
import useGlobalState from "@hooks/use-global-state";
import AddIcon from "@icons/add";
import { axJoinUserGroup, axLeaveUserGroup } from "@services/usergroup.service";
import { waitForAuth } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuMinus } from "react-icons/lu";

interface JoinUserGroupProps {
  currentGroup;
  isCurrentGroupMember;
  setIsCurrentGroupMember;
  showSignInRequired?;
  showLeave?;
}

export default function JoinUserGroup({
  currentGroup,
  isCurrentGroupMember,
  setIsCurrentGroupMember,
  showSignInRequired,
  showLeave
}: JoinUserGroupProps) {
  const { isLoggedIn } = useGlobalState();
  const [isLoading, setLoading] = useState<boolean>();
  const { t } = useTranslation();

  const addUserGroupMember = async () => {
    waitForAuth();
    setLoading(true);
    const canAddMember = currentGroup.isParticipatory || confirm(t("group:confirm_closed_group"));
    if (canAddMember) {
      const { success } = await axJoinUserGroup(currentGroup.id);
      if (success) {
        setIsCurrentGroupMember(true);
        notification(
          currentGroup.isParticipatory ? t("group:member.joined") : t("group:member.requested"),
          NotificationType.Success
        );
      } else {
        notification(t("group:member.joined_error"), NotificationType.Error);
      }
    }
    setLoading(false);
  };

  const removeUserGroupMember = async () => {
    waitForAuth();

    if (confirm(t("group:confirm_leave"))) {
      setLoading(true);
      const { success } = await axLeaveUserGroup(currentGroup.id);
      if (success) {
        setIsCurrentGroupMember(false);
        notification(t("group:member.left"), NotificationType.Info);
      } else {
        notification(t("group:member.left_error"));
      }
      setLoading(false);
    }
  };

  // explicit false check is necessary to avoid button flickr
  return isLoggedIn ? (
    isCurrentGroupMember === false ? (
      <Button
        className="join-usergroup"
        size="sm"
        loading={isLoading}
        colorPalette="green"
        onClick={addUserGroupMember}
      >
        <AddIcon />
        {t("group:join")}
      </Button>
    ) : (
      <Button
        hidden={!showLeave}
        size="sm"
        loading={isLoading}
        colorPalette="red"
        onClick={removeUserGroupMember}
      >
        <LuMinus />
        {t("group:leave")}
      </Button>
    )
  ) : (
    <Button size="sm" colorPalette="blue" onClick={waitForAuth} hidden={!showSignInRequired}>
      {t("common:session_required")}
    </Button>
  );
}
