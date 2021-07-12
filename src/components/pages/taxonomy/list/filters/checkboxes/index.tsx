import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { FilterCheckboxes, FilterCheckboxesProps } from "./checkboxes";

export function CheckboxFilterPanel(props: FilterCheckboxesProps) {
  const { t } = useTranslation();

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box flex={1} textAlign="left">
              {props.label || t(props.translateKey + "title")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>{isExpanded && <FilterCheckboxes {...props} />}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
