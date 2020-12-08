import { SimpleGrid, useCheckboxGroup } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { ITraitInputProps } from "..";
import TraitContent from "./content";

const SingleCategorialTrait = ({
  values,
  onUpdate,
  defaultValue,
  gridColumns = 5
}: ITraitInputProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onUpdate(value);
  }, [value]);

  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue: defaultValue && defaultValue.map((o) => o.toString()),
    onChange: (v) => setValue(v.map((i) => Number(i)))
  });

  return (
    <SimpleGrid columns={[1, 1, 2, gridColumns]} spacing={4}>
      {values?.map((o) => (
        <TraitContent
          key={o.id}
          label={o.value}
          icon={o.icon}
          {...getCheckboxProps({ value: String(o.id) })}
        />
      ))}
    </SimpleGrid>
  );
};

export default SingleCategorialTrait;
