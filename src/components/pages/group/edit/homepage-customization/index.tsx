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

import HomePageCustomizationForm from "./form";

export default function GroupHomePageCustomization({ userGroupId, homePageDetails }) {
  const { t } = useTranslation();
  return (
    <Accordion allowToggle>
      <AccordionItem mb={8} bg="white" border="1px solid var(--gray-300)" borderRadius="md">
        <AccordionButton _expanded={{ bg: "gray.100" }}>
          <Box flex={1} textAlign="left" fontSize="lg">
            🧰 {t("group:homepage_customization.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <HomePageCustomizationForm userGroupId={userGroupId} homePageDetails={homePageDetails} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
