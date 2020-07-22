import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading
} from "@chakra-ui/core";
import React from "react";
import HomePageCustomizationForm from "./form";

export default function GroupHomePageCustomization({ userGroupId, homePageDetails }) {
  return (
    <AccordionItem mb={8} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
      <AccordionHeader _expanded={{ bg: "gray.100" }}>
        <Heading as="h2" flex="1" textAlign="left" my={1} size="lg">
          🧰 Homepage Customization
        </Heading>
        <AccordionIcon float="right" />
      </AccordionHeader>

      <AccordionPanel>
        <HomePageCustomizationForm userGroupId={userGroupId} homePageDetails={homePageDetails} />
      </AccordionPanel>
    </AccordionItem>
  );
}
