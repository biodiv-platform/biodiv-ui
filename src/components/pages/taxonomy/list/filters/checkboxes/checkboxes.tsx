import { Box, Checkbox, CheckboxGroup, Image, Stack } from "@chakra-ui/react";
import { getTraitIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useTaxonFilter from "../../use-taxon";

export interface FilterCheckboxesProps {
  filterKey;
  label?;
  translateKey?;
  options;
  skipOptionsTranslation?: boolean;
}

export function FilterCheckboxes({
  filterKey,
  translateKey,
  options,
  skipOptionsTranslation
}: FilterCheckboxesProps) {
  const { filter, addFilter, removeFilter } = useTaxonFilter();
  const defaultValue = filter?.[filterKey] ? filter?.[filterKey]?.split(",") : [];
  const { t } = useTranslation();

  const handleOnChange = (v) => {
    if (v.length > 0) {
      addFilter(filterKey, v.toString());
    } else {
      removeFilter(filterKey);
    }
  };

  return (
    <>
      <CheckboxGroup defaultValue={defaultValue} onChange={handleOnChange}>
        <Stack>
          {options.map(({ label, value, valueIcon, color }) => (
            <Checkbox key={label} value={value} alignItems="baseline">
              {color && (
                <Box display="inline-flex" bg={color} h="1rem" w="1rem" mr={1} borderRadius="lg" />
              )}
              {valueIcon && (
                <Image
                  src={getTraitIcon(valueIcon, 20)}
                  boxSize="1.25rem"
                  objectFit="contain"
                  display="inline"
                  verticalAlign="center"
                  mr={1}
                  ignoreFallback={true}
                />
              )}
              {skipOptionsTranslation ? label || value : t(translateKey + label)}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </>
  );
}
