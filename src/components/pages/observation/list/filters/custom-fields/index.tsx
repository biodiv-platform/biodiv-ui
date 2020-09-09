import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@hooks/useObservationFilter";
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
              <AccordionHeader>
                <div>{customField.name}</div>
                <AccordionIcon />
              </AccordionHeader>
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
