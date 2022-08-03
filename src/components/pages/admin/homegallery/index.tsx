import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import HomePageGalleryCustomizationForm from "./form";

function HomeComponent({ homeInfo }) {
  const { t } = useTranslation();

  return (
    <Flex className="container fadeInUp" align="center" justify="left" pt={6}>
      <Accordion allowToggle>
        <AccordionItem
          mb={8}
          bg="white"
          border="1px solid var(--chakra-colors-gray-300)"
          borderRadius="md"
        >
          <AccordionButton _expanded={{ bg: "gray.100" }}>
            <Box flex={1} textAlign="left" pr="960px">
              🧰 {t("group:homepage_customization.title")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HomePageGalleryCustomizationForm homePageDetails={homeInfo} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}

export default HomeComponent;
