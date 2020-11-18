import { Accordion } from "@chakra-ui/react";
import React from "react";

export default function SubAccordion({ children }) {
  return (
    <Accordion
      allowMultiple={true}
      borderRadius="lg"
      borderX="1px solid"
      borderColor="gray.200"
      m={1}
      overflow="hidden"
    >
      {children}
    </Accordion>
  );
}
