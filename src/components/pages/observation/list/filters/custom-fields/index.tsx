import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text
} from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import SubAccordion from "../shared/sub-accordion";
import CustomFieldTypes from "./filter-types";

export default function CustomFieldsFilter() {
  const { observationData } = useObservationFilter();
  const { t } = useTranslation();

  return Object.keys(observationData.ag.groupCustomField || {}).length ? (
    <SubAccordion>
      {Object.keys(observationData.ag.groupCustomField || {}).map((customField) => (
        <AccordionItem key={customField.split("|")[1]}>
          {({ isExpanded }) => (
            <>
              <AccordionButton>
                <Box flex={1} textAlign="left">
                  {customField.split("|")[0]}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {isExpanded && (
                  <CustomFieldTypes
                    field={{
                      name: customField.split("|")[0],
                      id: customField.split("|")[1],
                      fieldtype: customField.split("|")[2],
                      values: Object.keys(observationData.ag.groupCustomField?.[customField] || {}).map(
                        (value) => ({ value })
                      )}
                    }
                    key={customField.split("|")[1]}
                  />
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </SubAccordion>
  ) : (
    <Text>{t("filters:no_custom_field")}</Text>
  );
}
