import { Accordion } from "@chakra-ui/core";
import React from "react";

import MapAreaFilter from "./map-area";

export default function LocationFilter() {
  return (
    <Accordion
      borderX="1px solid"
      borderColor="gray.200"
      m={1}
      defaultIndex={[0]}
      borderRadius="lg"
      overflow="hidden"
      allowMultiple={true}
    >
      <MapAreaFilter />
    </Accordion>
  );
}
