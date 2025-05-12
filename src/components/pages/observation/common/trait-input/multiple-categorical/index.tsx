import { SimpleGrid, useCheckboxGroup } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { ITraitInputProps } from "..";
import TraitContent from "./content";

const MultipleCategorialTrait = ({
  values,
  onUpdate,
  defaultValue,
  gridColumns = 5
}: ITraitInputProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onUpdate(value);
  }, [value]);

  const { getItemProps } = useCheckboxGroup({
    defaultValue: defaultValue && defaultValue.map((o) => o.toString()),
    onValueChange: (v) => setValue(v.map((i) => Number(i)))
  });

  return (
    <SimpleGrid columns={[1, 1, 2, gridColumns]} gap={4}>
      {values?.map((o) => (
        <TraitContent
          key={o.id}
          label={o.value}
          icon={o.icon}
          {...getItemProps({ value: String(o.traitValueId) })}
        />
      ))}
    </SimpleGrid>
  );
};

export default MultipleCategorialTrait;
