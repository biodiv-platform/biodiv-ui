import { CheckboxGroup, Image, Input, Stack } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { getTraitIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";

import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup } from "@/components/ui/input-group";

import FilterStat from "../stat";

export interface FilterCheckboxesProps {
  filterKey: string;
  label?: string;
  translateKey?: string;
  statKey?: string;
  options: any[];
  skipTitleTranslation?: boolean;
  skipOptionsTranslation?: boolean;
  showSearch?: boolean;
}

export default function FilterCheckboxes({
  filterKey,
  translateKey = "",
  statKey,
  options,
  skipOptionsTranslation,
  showSearch
}: FilterCheckboxesProps) {
  const { filter, addFilter, removeFilter, setAllMedia } = useObservationFilter();
  const { t } = useTranslation();

  const [search, setSearch] = useState("");

  const defaultValue = useMemo(
    () => (filter?.[filterKey] ? filter[filterKey].split(",") : []),
    [filter, filterKey]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(({ label }) => label?.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const handleOnChange = (values: string[]) => {
    if (values.length > 0) {
      addFilter(filterKey, values.join(","));
    } else {
      removeFilter(filterKey);
    }

    if (filterKey === "mediaFilter") {
      setAllMedia(values.length === 0 || values.includes("no_media"));
    }
  };

  return (
    <>
      {showSearch && (
        <InputGroup mb={2} pr={4} width="full" startElement={<LuSearch color="gray.300" />}>
          <Input
            type="text"
            placeholder={t("common:search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      )}

      <CheckboxGroup value={defaultValue} onValueChange={handleOnChange} colorPalette="blue">
        <Stack>
          {filteredOptions.map(({ label, value, stat, valueIcon }) => (
            <Checkbox key={value} value={value} alignItems="baseline">
              {valueIcon && (
                <Image
                  src={getTraitIcon(valueIcon, 20)}
                  boxSize="1.25rem"
                  objectFit="contain"
                  display="inline"
                  verticalAlign="center"
                  mr={1}
                />
              )}

              {skipOptionsTranslation ? label : t(`${translateKey}${label}`)}

              <FilterStat statKey={statKey} subStatKey={stat || value} />
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </>
  );
}
