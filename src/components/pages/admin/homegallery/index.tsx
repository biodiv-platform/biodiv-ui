import { Box, Flex } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot
} from "@/components/ui/accordion";

import HomePageGalleryCustomizationForm from "./form";

function HomeComponent({ homeInfo }) {
  const { t } = useTranslation();

  return (
    <Flex className="container fadeInUp" align="center" justify="left" pt={6}>
      <AccordionRoot multiple>
        <AccordionItem
          mb={8}
          bg="white"
          border="1px solid var(--chakra-colors-gray-300)"
          borderRadius="md"
          value="home"
        >
          <AccordionItemTrigger _expanded={{ bg: "gray.100" }} pl={4} pr={4}>
            <Box flex={1} textAlign="left" pr="960px">
              🧰 {t("group:homepage_customization.title")}
            </Box>
          </AccordionItemTrigger>
          <AccordionItemContent p={4}>
            <HomePageGalleryCustomizationForm homePageDetails={homeInfo} />
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    </Flex>
  );
}

export default HomeComponent;
