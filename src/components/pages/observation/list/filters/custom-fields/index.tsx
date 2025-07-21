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
  const { observationData } = useObservationFilter();
  const { t } = useTranslation();

  return Object.keys(observationData.ag.groupCustomField || {}).length ? (
    <SubAccordion>
      {Object.keys(observationData.ag.groupCustomField || {}).map((customField) => (
        <AccordionItem key={customField.split("|")[1]} value={customField.split("|")[1]} pl={4}>
          <AccordionItemTrigger pr={4}>
            <Box flex={1} textAlign="left">
              {customField.split("|")[0]}
            </Box>
          </AccordionItemTrigger>
          <AccordionItemContent pr={4}>
            <CustomFieldTypes
              field={{
                name: customField.split("|")[0],
                id: customField.split("|")[1],
                fieldtype: customField.split("|")[2],
                values: Object.keys(observationData.ag.groupCustomField?.[customField] || {}).map(
                  (value) => ({ value })
                )
              }}
              key={customField.split("|")[1]}
            />
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </SubAccordion>
  ) : (
    <Text>{t("filters:no_custom_field")}</Text>
  );
}
