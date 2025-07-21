import React from "react";

import { AccordionRoot } from "@/components/ui/accordion";

export default function SubAccordion({ children }) {
  return (
    <AccordionRoot
      multiple={true}
      borderRadius="lg"
      borderX="1px solid"
      borderColor="gray.200"
      m={1}
      overflow="hidden"
      pl={6}
      pr={8}
    >
      {children}
    </AccordionRoot>
  );
}
