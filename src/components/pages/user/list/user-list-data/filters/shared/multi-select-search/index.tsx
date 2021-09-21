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
  translateKey = "",
  filterKeyList,
  useIndexFilter,
  options = null
}: FilterMultiSelectProps) {
  const { t } = useTranslation();
  const label = t(translateKey);

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
              <FilterMultiSelectInput
                filterKey={filterKey}
                useIndexFilter={useIndexFilter}
                filterKeyList={filterKeyList}
                label={label}
                options={options}
              />
            )}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
