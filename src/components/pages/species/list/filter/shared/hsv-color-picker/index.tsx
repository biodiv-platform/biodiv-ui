import { Box } from "@chakra-ui/react";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { HsvColorPicker } from "react-colorful";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import useSpeciesList from "../../../use-species-list";

export interface FilterHsvProps {
  filterKey;
  label?;
  translateKey?;
}

export default function HsvColorFilter(props: FilterHsvProps) {
  const { addFilter, removeFilter } = useSpeciesList();
  const { t } = useTranslation();
  const onQuery = debounce((val) => handleOnChange(val), 200);

  const handleOnChange = (val) => {
    if (val) {
      const { h, s, v } = val;
      addFilter(props.filterKey, `${h},${s},${v}`);
    } else {
      removeFilter(props.filterKey);
    }
  };

  return (
    <AccordionItem value={props.filterKey} pl={4}>
      <AccordionItemTrigger pr={4}>
        <Box flex={1} textAlign="left">
          {props.label || t(props.translateKey + "title")}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent>{<HsvColorPicker onChange={onQuery} />}</AccordionItemContent>
    </AccordionItem>
  );
}
