import { SimpleGrid, useRadioGroup } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { ITraitInputProps } from "..";
import TraitContent from "./content";

const SingleCategorialTrait = ({
  name,
  values,
  onUpdate,
  defaultValue,
  gridColumns = 5
}: ITraitInputProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onUpdate(value);
  }, [value]);

  const { getRootProps, getItemProps } = useRadioGroup({
    name,
    value: value ? value.toString() : null,
    onValueChange: setValue
  });

  return (
    <SimpleGrid columns={[1, 1, 2, gridColumns]} gap={4} {...getRootProps()}>
      {values?.map((o) => (
        <TraitContent
          key={o.id}
          label={o.value}
          icon={o.icon}
          {...getItemProps({ value: o?.traitValueId?.toString() || "" })}
        />
      ))}
    </SimpleGrid>
  );
};

export default SingleCategorialTrait;
