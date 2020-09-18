import {
  AccordionButton,
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
              <AccordionButton>
                <div>{customField.name}</div>
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
