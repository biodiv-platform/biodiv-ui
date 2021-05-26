import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import React from "react";

export default function TaxonInputField({ label, name }) {
  const onQuery = async (q) => await onScientificNameQuery(q, "name");

  const onChange = async (value, event, setSelected) => {
    if (event.action === "select-option") {
      const o = value[value.length - 1];
      value[value.length - 1] = { id: o.raw.id, label: o.label };
    }
    setSelected(value);
  };

  return (
    <SelectAsyncInputField
      name={name}
      onQuery={onQuery}
      optionComponent={ScientificNameOption}
      label={label}
      eventCallback={onChange}
      placeholder={label}
      isClearable={false}
      multiple={true}
    />
  );
}
