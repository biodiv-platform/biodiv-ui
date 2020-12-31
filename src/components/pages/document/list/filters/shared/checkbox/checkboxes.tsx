import {
  Checkbox,
  CheckboxGroup,
  Image,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { getTraitIcon } from "@utils/media";
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
        <InputGroup mb={2}>
          <InputLeftElement children={<SearchIcon color="gray.300" />} />
          <Input type="text" placeholder={t("SEARCH")} onChange={handleOnSearch} />
        </InputGroup>
      )}
      <CheckboxGroup defaultValue={defaultValue} onChange={handleOnChange}>
        {filteredOptions.map(({ label, value, stat, valueIcon }) => (
          <Checkbox key={label} value={value} alignItems="baseline">
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
            <FilterStat statKey={statKey} subStatKey={stat || value} />
          </Checkbox>
        ))}
      </CheckboxGroup>
    </>
  );
}
