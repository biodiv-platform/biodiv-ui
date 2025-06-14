import {
  Box,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack
} from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { SubmitButton } from "@components/form/submit-button";
import useUserList from "@components/pages/user/common/use-user-filter";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axBulkRemoveGroupMembers } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function BulkMapperModal() {
  const { t } = useTranslation();
  const { onClose, isOpen, bulkUserIds, selectAll, unselectedUserIds, filter } = useUserList();

  const { currentGroup } = useGlobalState();

  const router = useLocalRouter();

  const checkBoxValue = [];

  const projectForm = useForm<any>({});

  const [isBulkRemove, setIsBulkRemove] = useState(false);

  const handleFormSubmit = async () => {
    const params = {
      ...filter,
      selectAll: selectAll,
      unSelectedIds: unselectedUserIds?.toString(),
      userIds: bulkUserIds?.toString() || "",
      userGroupId: currentGroup?.id?.toString() || "",
      isBulkRemove: isBulkRemove
    };

    console.warn(params);
    const { success } = await axBulkRemoveGroupMembers(params);
    if (success) {
      notification(t("user:bulk_action.success"), NotificationType.Success);
    } else {
      notification(t("user:bulk_action.failure"));
    }
    router.push("/user/list", true, { ...filter }, true);
    onClose();
  };

  const handleOnChange = (selectedValues) => {
    if (selectedValues.includes("bulkRemove")) {
      setIsBulkRemove(true);
    }
  };

  const actions = [{ id: "bulkRemove", name: `${t("user:bulk_action.title")}` }];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("user:bulk_action.select_actions")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...projectForm}>
            <form className="fade" onSubmit={projectForm.handleSubmit(handleFormSubmit)}>
              <Box mb={"4"}>
                <CheckboxGroup defaultValue={checkBoxValue} onChange={handleOnChange}>
                  <Stack>
                    {actions.map(({ id, name }) => (
                      <Checkbox value={String(id)} alignItems="baseline">
                        {name}
                        {currentGroup?.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
              <SubmitButton leftIcon={<CheckIcon />}>{t("user:bulk_action.apply")}</SubmitButton>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
