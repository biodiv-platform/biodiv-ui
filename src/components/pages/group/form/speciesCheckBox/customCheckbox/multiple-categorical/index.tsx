import { CheckboxGroup } from "@chakra-ui/core";
import React from "react";
import CustomCheckbox from "./checkbox";

export interface ITraitInputProps {
  type?: string;
  values: any[];
  gridColumns?;
  onUpdate;
  defaultValue?;
}

const MultipleSpeciesSelector = ({ values, onUpdate, defaultValue }: ITraitInputProps) => (
  <CheckboxGroup
    defaultValue={defaultValue && defaultValue.map((o) => o.toString())}
    onChange={(v) => onUpdate(v.map((i) => Number(i)))}
    display="flex"
  >
    {values.map((o) => (
      <CustomCheckbox key={o.id} value={o.id.toString()} label={o.value} icon={o.name} />
    ))}
  </CheckboxGroup>
);

export default MultipleSpeciesSelector;
