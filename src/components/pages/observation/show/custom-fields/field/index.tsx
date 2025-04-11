import { IconButton, useDisclosure } from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import { CustomFieldData } from "@interfaces/observation";
import { axUpdateCustomField } from "@services/observation.service";
import { ACTIVITY_UPDATED } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit } from "react-gbus";

import { Field } from "@/components/ui/field";

import FieldData from "./field-data";

interface ICustomFieldProps {
  cf: CustomFieldData;
  setO;
  canEdit;
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
  const { open, onClose, onToggle } = useDisclosure();
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
      notification(t("observation:cf_update_success"), NotificationType.Success);
    }
    onClose();
  };

  return (
    <Field borderBottom="1px" borderColor="gray.300" p={4}>
      <Field fontWeight="bold" htmlFor={cf.cfId?.toString()}>
        {cf.cfName}
        {canEdit && (
          <IconButton variant="plain" colorPalette="blue" aria-label="edit" onClick={onToggle}>
            <EditIcon />
          </IconButton>
        )}
      </Field>
      {open && cf.cfNotes && (
        <Field mt={0} mb={2} id={`${cf.cfId}-helper`} helperText={cf.cfNotes}></Field>
      )}
      <FieldData
        onClose={onClose}
        cf={cf}
        isOpen={open}
        onUpdate={onUpdate}
        userGroupId={userGroupId}
        observationId={observationId}
      />
    </Field>
  );
}
