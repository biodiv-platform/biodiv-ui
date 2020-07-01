import { AccordionHeader, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import FilterMultiSelectInput, { FilterMultiSelectProps } from "./input";

export default function FilterMultiSelectPanel({
  filterKey,
  translateKey,
  options
}: FilterMultiSelectProps) {
  const { t } = useTranslation();
  const label = t(translateKey);

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionHeader>
            <div>{label}</div>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel>
            {isExpanded && (
              <FilterMultiSelectInput filterKey={filterKey} label={label} options={options} />
            )}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
