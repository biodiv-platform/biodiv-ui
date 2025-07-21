import { SimpleGrid } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
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
  const [value, setValue] = useState(defaultValue?.toString());

  useEffect(() => {
    onUpdate(value);
  }, [value]);

  return (
    <RadioCard.Root
      name={name}
      value={value}
      onValueChange={({ value }) => setValue(value)}
      colorPalette="blue"
      size="sm"
    >
      <SimpleGrid columns={[1, 1, 2, gridColumns]} gap={4}>
        {values?.map((o) => (
          <TraitContent
            key={o.id}
            value={o?.traitValueId?.toString() || ""}
            label={o.value}
            icon={o.icon}
          />
        ))}
      </SimpleGrid>
    </RadioCard.Root>
  );
};

export default SingleCategorialTrait;
