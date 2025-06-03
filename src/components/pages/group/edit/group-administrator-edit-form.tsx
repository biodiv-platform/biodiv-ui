import { Box } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import { axAddGroupAdminMembers, axUserGroupRemoveAdminMembers } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import AdminInviteField from "../common/admin-invite-field";
import { transformMemberPayload } from "../create";

const discardExistingAdministrators = (updatedMembers, currentAdministrators) => {
  const newAdministrators = updatedMembers.filter(
    ({ value }) => !currentAdministrators.includes(value)
  );
  return transformMemberPayload(newAdministrators);
};

export default function GroupAdministratorsEditForm({ founders, moderators, userGroupId }) {
  const { t } = useTranslation();

  const founderIds = founders.map(({ value }) => value);
  const moderatorIds = moderators.map(({ value }) => value);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        founders: Yup.array().nullable(),
        moderators: Yup.array().nullable()
      })
    ),
    defaultValues: {
      founders,
      moderators
    }
  });

  /**
   * This function will be invoked when someone clicks on `X` button on user
   * But will make api-request only when user is in existing list
   *
   * @param {*} { value }
   * @returns
   */
  const onMemberRemoved = async ({ value }, initialMembers) => {
    if (initialMembers.includes(value)) {
      return await axUserGroupRemoveAdminMembers(userGroupId, value);
    }

    return { success: true };
  };

  const handleFormSubmit = async (values) => {
    const founderData = discardExistingAdministrators(values.founders, founderIds);
    const moderatorData = discardExistingAdministrators(values.moderators, moderatorIds);
    const membersData = transformMemberPayload(values.members);
    const payload = {
      userGroupId,
      founderIds: founderData.idsList,
      moderatorsIds: moderatorData.idsList,
      memberIds: membersData.idsList,
      founderEmail: founderData.emailList,
      moderatorsEmail: moderatorData.emailList
    };
    const { success } = await axAddGroupAdminMembers(payload);
    if (success) {
      notification(t("group:admin.updated"), NotificationType.Success);
    } else {
      notification(t("group:admin.error"), NotificationType.Error);
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
        <AdminInviteField
          name="founders"
          label="Edit Founders"
          onRemove={(o) => onMemberRemoved(o, founderIds)}
          resetOnSubmit={false}
        />
        <AdminInviteField
          name="moderators"
          label="Edit Moderators"
          onRemove={(o) => onMemberRemoved(o, moderatorIds)}
          resetOnSubmit={false}
        />
        <AdminInviteField
          name="members"
          label="Add Members"
          onRemove={(o) => onMemberRemoved(o, [])}
        />
        <Box mb={4}>
          <LocalLink href={"/user/list"} prefixGroup={true}>
            <BlueLink display="block">{t("group:admin.view_members")}</BlueLink>
          </LocalLink>
        </Box>
        <SubmitButton>{t("common:update")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
