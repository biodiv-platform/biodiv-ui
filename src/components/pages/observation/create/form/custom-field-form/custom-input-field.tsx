import { SelectInputField } from "@components/form/select";
import { SelectMultipleInputField } from "@components/form/select-multiple";
import { TextBoxField } from "@components/form/text";
import React from "react";

import CustomFieldOptions from "./custom-field-options";

interface IObservationCustomField {
  name: string;
  label: string;
  fieldType: string;
  isRequired?: boolean;
  dataType?: string;
  hint?: string;
  options?;
}
export default function ObservationCustomFieldInput({
  name,
  fieldType,
  dataType,
  label,
  isRequired,
  options,
  hint
}: IObservationCustomField) {
  switch (fieldType) {
    case "SINGLE CATEGORICAL":
      return (
        <SelectInputField
          name={name}
          label={label}
          options={options}
          isRequired={isRequired}
          hint={hint}
          optionComponent={CustomFieldOptions}
          mb={0}
        />
      );

    case "MULTIPLE CATEGORICAL":
      return (
        <SelectMultipleInputField
          name={name}
          label={label}
          hint={hint}
          isRequired={isRequired}
          optionComponent={CustomFieldOptions}
          options={options}
          mb={0}
        />
      );

    default:
      return (
        <TextBoxField
          name={name}
          type={dataType === ("INTEGER" || "DECIMAL") ? "number" : "text"}
          label={label}
          hint={hint}
          isRequired={isRequired}
          mb={0}
        />
      );
  }
}
