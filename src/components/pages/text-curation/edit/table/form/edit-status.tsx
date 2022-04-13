import { Box } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { CURATED_STATUS } from "../data";

const CURATION_OPTIONS = Object.entries(CURATED_STATUS).map(([label, value]) => ({ label, value }));

export default function EditStatus() {
  const { t } = useTranslation();

  return (
    <Box px={4} mb={6}>
      <SelectInputField
        name="curatedStatus"
        label={t("text-curation:curated.status")}
        options={CURATION_OPTIONS}
        mb={4}
      />
    </Box>
  );
}
