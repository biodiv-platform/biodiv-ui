import { Box } from "@chakra-ui/react";
import { RadioInputField } from "@components/form/radio";
import React from "react";
import { useFormContext } from "react-hook-form";

import { CURATED_STATUS } from "../data";

const CURATION_OPTIONS = Object.entries(CURATED_STATUS).map(([label, value]) => ({ label, value }));

export default function EditStatus({ userName }) {
  const hForm = useFormContext();
  hForm.setValue("curatedBy", userName);
  return (
    <Box px={4} mb={6}>
      <RadioInputField name="curatedStatus" options={CURATION_OPTIONS} mb={4} isInline={false} />
    </Box>
  );
}
