import { SearchIcon } from "@chakra-ui/icons";
import {
  Checkbox,
  CheckboxGroup,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack
} from "@chakra-ui/react";
import useUserListFilter from "@components/pages/user/common/use-user-filter";
import { getTraitIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import FilterStat from "../stat";

export interface FilterCheckboxesProps {
  filterKey;
  label?;
  translateKey?;
  statKey?;
  options;
  skipTitleTranslation?: boolean;
  skipOptionsTranslation?: boolean;
  showStat?: boolean;
  isTaxonFilter?: boolean;
  showSearch?: boolean;
}

export default function FilterCheckboxes({
  filterKey,
  translateKey,
  statKey,
  options,
  showStat = true,
  skipOptionsTranslation,
  showSearch
}: FilterCheckboxesProps) {
  const { filter, addFilter, removeFilter } = useUserListFilter();
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
        <InputGroup mb={2}>
          <InputLeftElement children={<SearchIcon color="gray.300" />} />
          <Input type="text" placeholder={t("common:search")} onChange={handleOnSearch} />
        </InputGroup>
      )}
      <CheckboxGroup defaultValue={defaultValue} onChange={handleOnChange}>
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
                  mr={1}
                  ignoreFallback={true}
                />
              )}
              {skipOptionsTranslation ? label || value : t(translateKey + label)}
              {showStat && <FilterStat statKey={statKey} subStatKey={value || label} />}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </>
  );
}
