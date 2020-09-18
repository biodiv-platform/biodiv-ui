import { CheckboxGroup, SimpleGrid } from "@chakra-ui/core";
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
  >
    <SimpleGrid className="custom-checkbox-group" gridGap={4} columns={[1, 1, 2, gridColumns]}>
      {values.map((o) => (
        <Checkbox key={o.id} value={o.id.toString()} label={o.value} icon={o.icon} />
      ))}
    </SimpleGrid>
  </CheckboxGroup>
);

export default MultipleCategorialTrait;
