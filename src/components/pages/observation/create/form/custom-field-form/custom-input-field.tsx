import SelectInputField from "@components/form/select";
import SelectMultipleInputField from "@components/form/select-multiple";
import TextBoxField from "@components/form/text";
import React from "react";
import { UseFormMethods } from "react-hook-form";

import CustomFieldOptions from "./custom-field-options";

interface IObservationCustomField {
  name: string;
  label: string;
  fieldType: string;
  isRequired?: boolean;
  dataType?: string;
  form: UseFormMethods<Record<string, any>>;
  options?;
}
export default function ObservationCustomFieldInput({
  name,
  fieldType,
  dataType,
  label,
  form,
  isRequired,
  options
}: IObservationCustomField) {
  switch (fieldType) {
    case "SINGLE CATEGORICAL":
      return (
        <SelectInputField
          form={form}
          name={name}
          label={label}
          options={options}
          isRequired={isRequired}
          optionComponent={CustomFieldOptions}
          mb={0}
        />
      );

    case "MULTIPLE CATEGORICAL":
      return (
        <SelectMultipleInputField
          form={form}
          name={name}
          label={label}
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
          isRequired={isRequired}
          form={form}
          mb={0}
        />
      );
  }
}
