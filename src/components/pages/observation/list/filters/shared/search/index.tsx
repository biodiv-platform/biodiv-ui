import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import React from "react";

import TextFilterInput from "./input";

export default function TextFilterPanel({ filterKey, translateKey }) {
  const { t } = useTranslation();
  const label = t(translateKey + "TITLE");

  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex={1} textAlign="left">
          {label}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <TextFilterInput filterKey={filterKey} label={label} />
      </AccordionPanel>
    </AccordionItem>
  );
}
