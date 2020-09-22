import { SimpleGrid, useRadio, useRadioGroup } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";

import { ITraitInputProps } from "..";
import TraitContent from "../content";

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

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value: value ? value.toString() : null,
    onChange: (v) => (v === value ? null : setValue(Number(v)))
  });

  return (
    <SimpleGrid columns={[1, 1, 2, gridColumns]} spacing={4} {...getRootProps()}>
      {values.map((o) => (
        <TraitContent
          key={o.id}
          label={o.value}
          icon={o.icon}
          inputHook={useRadio}
          {...getRadioProps({ value: o.id.toString() })}
        />
      ))}
    </SimpleGrid>
  );
};

export default SingleCategorialTrait;
