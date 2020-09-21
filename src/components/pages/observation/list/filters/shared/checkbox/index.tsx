import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import FilterCheckboxes, { FilterCheckboxesProps } from "./checkboxs";

export default function CheckboxFilterPanel(props: FilterCheckboxesProps) {
  const { t } = useTranslation();

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box flex={1} textAlign="left">
              {props.label || t(props.translateKey + "TITLE")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>{isExpanded && <FilterCheckboxes {...props} />}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
