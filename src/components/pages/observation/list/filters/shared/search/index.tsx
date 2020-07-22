import { AccordionHeader, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import TextFilterInput from "./input";

export default function TextFilterPanel({ filterKey, translateKey }) {
  const { t } = useTranslation();
  const label = t(translateKey + "TITLE");

  return (
    <AccordionItem>
      <AccordionHeader>
        <div>{label}</div>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel>
        <TextFilterInput filterKey={filterKey} label={label} />
      </AccordionPanel>
    </AccordionItem>
  );
}
