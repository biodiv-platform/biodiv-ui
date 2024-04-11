import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import ObservationCustomizationForm from "./form";

export default function ObservationCustomizations({ userGroupId, mediaToggle }) {
  const { t } = useTranslation();
  return (
    <Accordion allowToggle>
      <AccordionItem
        mb={8}
        bg="white"
        border="1px solid var(--chakra-colors-gray-300)"
        borderRadius="md"
      >
        <AccordionButton _expanded={{ bg: "gray.100" }}>
          <Box flex={1} textAlign="left" fontSize="lg">
            🧰 {t("group:observation_customisation")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <ObservationCustomizationForm userGroupId={userGroupId} mediaToggle={mediaToggle} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
