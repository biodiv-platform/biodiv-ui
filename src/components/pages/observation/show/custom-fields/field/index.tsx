import { FormControl, FormHelperText, FormLabel, IconButton, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { CustomFieldData } from "@interfaces/observation";
import { axUpdateCustomField } from "@services/observation.service";
import { ACTIVITY_UPDATED } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { emit } from "react-gbus";

import FieldData from "./field-data";

interface ICustomFieldProps {
  cf: CustomFieldData;
  setO;
  canEdit: boolean;
  userGroupId;
  observationId;
}

export default function CustomField({
  cf,
  setO,
  userGroupId,
  observationId,
  canEdit
}: ICustomFieldProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { t } = useTranslation();

  const onUpdate = async (fieldData) => {
    const { success, data } = await axUpdateCustomField({
      userGroupId,
      customFieldId: cf.cfId,
      observationId,
      ...fieldData
    });
    if (success) {
      setO(data);
      emit(ACTIVITY_UPDATED, observationId);
      notification(t("OBSERVATION.CF_UPDATE_SUCCESS"), NotificationType.Success);
    }
    onClose();
  };

  return (
    <FormControl borderBottom="1px" borderColor="gray.300" p={4}>
      <FormLabel fontWeight="bold" htmlFor={cf.cfId.toString()}>
        {cf.cfName}
        {canEdit && (
          <IconButton
            variant="link"
            variantColor="blue"
            icon="edit"
            aria-label="edit"
            onClick={onToggle}
          />
        )}
      </FormLabel>
      {isOpen && cf.cfNotes && (
        <FormHelperText mt={0} mb={2} id={`${cf.cfId}-helper`}>
          {cf.cfNotes}
        </FormHelperText>
      )}
      <FieldData
        onClose={onClose}
        cf={cf}
        isOpen={isOpen}
        onUpdate={onUpdate}
        userGroupId={userGroupId}
        observationId={observationId}
      />
    </FormControl>
  );
}
