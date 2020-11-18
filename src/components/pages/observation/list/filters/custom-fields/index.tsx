import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text
} from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import SubAccordion from "../shared/sub-accordion";
import CustomFieldTypes from "./filter-types";

export default function CustomFieldsFilter() {
  const { customFields } = useObservationFilter();
  const { t } = useTranslation();

  return customFields.length ? (
    <SubAccordion>
      {customFields.map((customField) => (
        <AccordionItem key={customField.id}>
          {({ isExpanded }) => (
            <>
              <AccordionButton>
                <Box flex={1} textAlign="left">
                  {customField.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {isExpanded && <CustomFieldTypes field={customField} key={customField.id} />}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </SubAccordion>
  ) : (
    <Text>{t("FILTERS.NO_CUSTOM_FIELD")}</Text>
  );
}
