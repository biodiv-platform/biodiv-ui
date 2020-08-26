import { FormControl, FormHelperText, FormLabel, IconButton, useDisclosure } from "@chakra-ui/core";
import { CustomFieldData } from "@interfaces/observation";
import { axUpdateCustomField } from "@services/observation.service";
import { ACTIVITY_UPDATED } from "@static/events";
import React from "react";
import { emit } from "react-gbus";

import FieldText from "./text";
import CategoricalField from "./catergorical-field";

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
    }
    onClose();
  };

  const FieldData = () => {
    switch (cf.fieldType) {
      // TODO: add other input types

      case "MULTIPLE CATEGORICAL":
      case "SINGLE CATEGORICAL":
        return <CategoricalField cf={cf} />;

      default:
        return <FieldText cf={cf} onUpdate={onUpdate} isOpen={isOpen} onClose={onClose} />;
    }
  };

  return (
    <FormControl borderBottom="1px" borderColor="gray.300" p={4}>
      <FormLabel fontWeight="bold" htmlFor={cf.cfId.toString()}>
        {cf.cfName}
        {canEdit && cf.fieldType === "FIELD TEXT" && (
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
      <FieldData />
    </FormControl>
  );
}
