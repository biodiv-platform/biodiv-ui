import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  CheckboxGroup
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@hooks/useObservationFilter";
import React from "react";

import FilterStat from "../stat";

export default function CheckboxFilterPanel({ filterKey, translateKey, statKey = null, options }) {
  const { filter, addFilter, removeFilter } = useObservationFilter();
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
    <AccordionItem>
      <AccordionHeader>
        <div>{t(translateKey + "TITLE")}</div>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel>
        <CheckboxGroup defaultValue={defaultValue} onChange={handleOnChange}>
          {options.map(({ label, value, stat }) => (
            <Checkbox key={label} value={value} onChange={handleOnChange}>
              {t(translateKey + label)} <FilterStat statKey={statKey} subStatKey={stat} />
            </Checkbox>
          ))}
        </CheckboxGroup>
      </AccordionPanel>
    </AccordionItem>
  );
}
