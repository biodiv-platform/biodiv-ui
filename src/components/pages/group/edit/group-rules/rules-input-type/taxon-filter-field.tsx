import SelectAsync from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import React from "react";

export default function TaxonInputField({ form, label, name }) {
  const onQuery = async (q) => await onScientificNameQuery(q, "name");

  const onChange = async (value, event, setSelected) => {
    if (event.action === "select-option") {
      const {
        label,
        raw: { id }
      } = value[value.length - 1];
      value[value.length - 1] = { id, label };
    }
    setSelected(value);
  };

  return (
    <SelectAsync
      name={name}
      onQuery={onQuery}
      optionComponent={ScientificNameOption}
      label={label}
      eventCallback={onChange}
      placeholder={label}
      form={form}
      isClearable={false}
      multiple={true}
    />
  );
}
