import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import SubmitButton from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
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
    <Accordion allowToggle={true}>
      <AccordionItem mb={8} bg="white" border="1px solid var(--gray-300)" borderRadius="md">
        <AccordionButton _expanded={{ bg: "gray.100" }}>
          <Box flex={1} textAlign="left" fontSize="lg">
            🛡️ {t("GROUP.ADMIN.TITLE")}
          </Box>
          <AccordionIcon />
        </AccordionButton>

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
    </Accordion>
  );
}
