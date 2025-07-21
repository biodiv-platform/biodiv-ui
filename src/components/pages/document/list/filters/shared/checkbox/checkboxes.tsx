import { CheckboxGroup, Image, Input, Stack } from "@chakra-ui/react";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { getTraitIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";

import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup } from "@/components/ui/input-group";

import FilterStat from "../stat";

export interface FilterCheckboxesProps {
  filterKey;
  label?;
  translateKey?;
  statKey?;
  options;
  skipTitleTranslation?: boolean;
  skipOptionsTranslation?: boolean;
  showSearch?: boolean;
}

export default function FilterCheckboxes({
  filterKey,
  translateKey,
  statKey,
  options,
  skipOptionsTranslation,
  showSearch
}: FilterCheckboxesProps) {
  const { filter, addFilter, removeFilter } = useDocumentFilter();
  const defaultValue = filter?.[filterKey] ? filter?.[filterKey]?.split(",") : [];
  const { t } = useTranslation();
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleOnChange = (v) => {
    if (v.length > 0) {
      addFilter(filterKey, v.toString());
    } else {
      removeFilter(filterKey);
    }
  };

  const handleOnSearch = (e) => {
    const searchQuery = e?.target?.value.toLowerCase();
    setFilteredOptions(options.filter(({ label }) => label.toLowerCase().includes(searchQuery)));
  };

  return (
    <>
      {showSearch && (
        <InputGroup mb={2} startElement={<LuSearch color="gray.300" />} width={"full"}>
          <Input type="text" placeholder={t("common:search")} onChange={handleOnSearch} />
        </InputGroup>
      )}
      <CheckboxGroup
        defaultValue={defaultValue}
        onValueChange={handleOnChange}
        colorPalette={"blue"}
      >
        <Stack>
          {filteredOptions.map(({ label, value, valueIcon }) => (
            <Checkbox mr={4} key={label} value={value} alignItems="baseline">
              {valueIcon && (
                <Image
                  src={getTraitIcon(valueIcon, 20)}
                  boxSize="1.25rem"
                  objectFit="contain"
                  display="inline"
                  verticalAlign="center"
                  marginEnd={1}
                />
              )}
              {skipOptionsTranslation ? label || value : t(translateKey + label)}
              <FilterStat statKey={statKey} subStatKey={value || label} />
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </>
  );
}
