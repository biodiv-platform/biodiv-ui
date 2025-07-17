import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot
} from "@/components/ui/accordion";

import HomePageCustomizationForm from "./form";

export default function GroupHomePageCustomization({ userGroupId, homePageDetails }) {
  const { t } = useTranslation();
  return (
    <AccordionRoot multiple>
      <AccordionItem
        mb={8}
        bg="white"
        border="1px solid var(--chakra-colors-gray-300)"
        borderRadius="md"
        value={"home"}
      >
        <AccordionItemTrigger _expanded={{ bg: "gray.100" }} pr={4}>
          <Box flex={1} textAlign="left" fontSize="lg" pl={4}>
            🧰 {t("group:homepage_customization.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent p={4}>
          <HomePageCustomizationForm userGroupId={userGroupId} homePageDetails={homePageDetails} />
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
