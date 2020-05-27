import { Box, SimpleGrid } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";

import { ITraitInputProps } from "..";
import Content from "../content";

const SingleCategorialTrait = ({
  values,
  onUpdate,
  defaultValue,
  gridColumns = 5
}: ITraitInputProps) => {
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    onUpdate(selected);
  }, [selected]);

  const handleOnClick = (value) => {
    setSelected(value === selected ? null : value);
  };

  return (
    <SimpleGrid columns={[1, 1, 2, gridColumns]} spacing={4}>
      {values.map((o) => (
        <Box
          key={o.id}
          role="radio"
          className="custom-radio"
          aria-checked={selected === o.id}
          onClick={() => handleOnClick(o.id)}
        >
          <Content value={o.value} label={o.value} icon={o.icon} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default SingleCategorialTrait;
