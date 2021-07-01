import { CustomFieldData } from "@interfaces/observation";
import React from "react";

import CategoricalField from "./catergorical-field";
import FieldText from "./text";

interface IFieldDataSwitchProps {
  cf: CustomFieldData;
  observationId?: number;
  userGroupId?: number;
  onUpdate?;
  isOpen;
  onClose;
}

export default function FieldDataSwitch({
  cf,
  observationId,
  userGroupId,
  onClose,
  isOpen,
  onUpdate
}: IFieldDataSwitchProps) {
  switch (cf.fieldType) {
    // TODO: add other input types

    case "MULTIPLE CATEGORICAL":
    case "SINGLE CATEGORICAL":
      return (
        <CategoricalField
          cf={cf}
          observationId={observationId}
          userGroupId={userGroupId}
          onUpdate={onUpdate}
          isOpen={isOpen}
          onClose={onClose}
        />
      );

    default:
      return <FieldText cf={cf} onUpdate={onUpdate} isOpen={isOpen} onClose={onClose} />;
  }
}
