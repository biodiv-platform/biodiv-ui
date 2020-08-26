import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading
} from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import SubmitButton from "@components/form/submit-button";
import useTranslation from "@configs/i18n/useTranslation";
import { yupResolver } from "@hookform/resolvers";
import useGlobalState from "@hooks/useGlobalState";
import { axAddGroupAdminMembers, axUserGroupRemoveAdminMembers } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
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
  const router = useLocalRouter();
  const {
    currentGroup: { name }
  } = useGlobalState();
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
    const payload = {
      userGroupId,
      founderIds: founderData.idsList,
      moderatorsIds: moderatorData.idsList,
      founderEmail: founderData.emailList,
      moderatorsEmail: moderatorData.emailList
    };
    const { success } = await axAddGroupAdminMembers(payload);
    if (success) {
      notification(t("GROUP.ADMIN.UPDATED"), NotificationType.Success);
      router.push(`/group/${name}/show`, false, {}, true);
    } else {
      notification(t("GROUP.ADMIN.ERROR"), NotificationType.Error);
    }
  };

  return (
    <AccordionItem mb={8} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
      <AccordionHeader _expanded={{ bg: "gray.100" }}>
        <Heading as="h2" flex="1" textAlign="left" my={1} size="lg">
          🛡️ {t("GROUP.ADMIN.TITLE")}
        </Heading>
        <AccordionIcon float="right" />
      </AccordionHeader>

      <AccordionPanel>
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
          <AdminInviteField
            form={hForm}
            name="founders"
            label="Founders"
            onRemove={(o) => onMemberRemoved(o, founderIds)}
          />
          <AdminInviteField
            form={hForm}
            name="moderators"
            label="Moderators"
            onRemove={(o) => onMemberRemoved(o, moderatorIds)}
          />
          <SubmitButton form={hForm}>{t("GROUP.UPDATE_ADMIN")}</SubmitButton>
        </form>
      </AccordionPanel>
    </AccordionItem>
  );
}
