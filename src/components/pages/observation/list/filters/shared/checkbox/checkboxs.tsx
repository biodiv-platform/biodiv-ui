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
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
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
  const { filter, addFilter, removeFilter, setAllMedia } = useObservationFilter();
  const defaultValue = filter?.[filterKey] ? filter?.[filterKey]?.split(",") : [];
  const { t } = useTranslation();
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleOnChange = (v) => {
    if (v.length > 0) {
      addFilter(filterKey, v.toString());
    } else {
      removeFilter(filterKey);
    }

    if (filterKey == "mediaFilter") {
      if (v.includes("no_media")) {
        setAllMedia(true);
      } else {
        setAllMedia(false);
      }
    }
  };

  const handleOnSearch = (e) => {
    const searchQuery = e?.target?.value.toLowerCase();
    setFilteredOptions(options.filter(({ label }) => label.toLowerCase().includes(searchQuery)));
  };

  const all = ["no_of_images", "no_of_videos", "no_of_audio", "no_media"];
  const media = ["no_of_images", "no_of_videos", "no_of_audio"];

  return (
    <>
      {showSearch && (
        <InputGroup mb={2}>
          <InputLeftElement children={<SearchIcon color="gray.300" />} />
          <Input type="text" placeholder={t("common:search")} onChange={handleOnSearch} />
        </InputGroup>
      )}
      <CheckboxGroup
        defaultValue={
          filterKey != "mediafilter"
            ? defaultValue
            : filter?.mediaFilter?.includes("no_media")
            ? all
            : media
        }
        onChange={handleOnChange}
        key={filterKey == "mediaFilter" ? filter?.mediaFilter?.toString() : "checkbox-filter-key"}
      >
        <Stack>
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
        </Stack>
      </CheckboxGroup>
    </>
  );
}
