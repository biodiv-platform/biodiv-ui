import { Box, Text } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import SubAccordion from "../shared/sub-accordion";
import CustomFieldTypes from "./filter-types";

export default function CustomFieldsFilter() {
  const { customFields } = useObservationFilter();
  const { t } = useTranslation();

  return customFields.length ? (
    <SubAccordion>
      {customFields.map((customField) => (
        <AccordionItem key={customField.id} value={customField.id} pl={4}>
          <AccordionItemTrigger pr={4}>
            <Box flex={1} textAlign="left">
              {customField.name}
            </Box>
          </AccordionItemTrigger>
          <AccordionItemContent>
            <CustomFieldTypes field={customField} key={customField.id} />
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </SubAccordion>
  ) : (
    <Text>{t("filters:no_custom_field")}</Text>
  );
}
