import { CheckboxGroup } from "@chakra-ui/core";
import React from "react";

import { ITraitInputProps } from "..";
import Checkbox from "./checkbox";

const MultipleCategorialTrait = ({
  values,
  onUpdate,
  defaultValue,
  gridColumns = 5
}: ITraitInputProps) => (
  <CheckboxGroup
    defaultValue={defaultValue && defaultValue.map((o) => o.toString())}
    onChange={(v) => onUpdate(v.map((i) => Number(i)))}
    display="grid"
    className="custom-checkbox-group"
    gridGap={4}
    gridTemplateColumns={[
      "repeat(1,1fr)",
      "repeat(1,1fr)",
      "repeat(2,1fr)",
      `repeat(${gridColumns},1fr)`
    ]}
  >
    {values.map((o) => (
      <Checkbox key={o.id} value={o.id.toString()} label={o.value} icon={o.icon} />
    ))}
  </CheckboxGroup>
);

export default MultipleCategorialTrait;
