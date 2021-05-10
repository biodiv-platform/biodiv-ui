import { FormControl, FormHelperText, Input, InputGroup, SimpleGrid } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useState } from "react";

import { ITraitInputProps } from "..";

const RangeTrait = ({ name, onUpdate, defaultValue, gridColumns = 5 }: ITraitInputProps) => {
  const [value, setValue] = useState(defaultValue?.[0]);
  const { t } = useTranslation();

  useEffect(() => {
    onUpdate([value]);
  }, [value]);

  return (
    <SimpleGrid columns={[1, 1, 2, gridColumns]} spacing={4}>
      <FormControl id={name}>
        <InputGroup maxW="md">
          <Input name={name} defaultValue={value} onChange={(e) => setValue(e.target.value)} />
        </InputGroup>
        <FormHelperText>{t("OBSERVATION.RANGE_HINT")}</FormHelperText>
      </FormControl>
    </SimpleGrid>
  );
};

export default RangeTrait;
