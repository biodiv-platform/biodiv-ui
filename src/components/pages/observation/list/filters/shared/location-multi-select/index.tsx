import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import FilterMultiSelectInput, { FilterMultiSelectProps } from "./input";

export default function FilterMultiSelectPanel({
  filterKey,
  translateKey,
  options
}: FilterMultiSelectProps) {
  const { t } = useTranslation();
  const label = translateKey && t(translateKey);

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box flex={1} textAlign="left">
              {label}
            </Box>
            <AccordionIcon />
          </AccordionButton>
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
