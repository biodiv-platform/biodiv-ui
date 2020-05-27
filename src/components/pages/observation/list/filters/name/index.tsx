import { Accordion } from "@chakra-ui/core";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import TextFilterPanel from "../shared/search";
import { RECO_NAME } from "./filter-keys";

export default function NameFilter() {
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
      <TextFilterPanel filterKey="recoName" translateKey="FILTERS.NAME.RECO_NAME." />

      <CheckboxFilterPanel
        translateKey="FILTERS.NAME.STATUS."
        filterKey="status"
        options={RECO_NAME}
        statKey={"groupStatus"}
      />
    </Accordion>
  );
}
