import { Input, SimpleGrid } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

import { ITraitInputProps } from "..";

const RangeTrait = ({ name, onUpdate, defaultValue, gridColumns = 5 }: ITraitInputProps) => {
  const [value, setValue] = useState(defaultValue?.[0]);
  const { t } = useTranslation();

  useEffect(() => {
    onUpdate([value]);
  }, [value]);

  return (
    <SimpleGrid columns={[1, 1, 2, gridColumns]} gap={4}>
      <Field id={name} helperText={t("observation:range_hint")}>
        <InputGroup maxW="md">
          <Input name={name} defaultValue={value} onChange={(e) => setValue(e.target.value)} />
        </InputGroup>
      </Field>
    </SimpleGrid>
  );
};

export default RangeTrait;
