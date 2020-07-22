import React from "react";
import { Box, Divider, Heading } from "@chakra-ui/core";

import CustomInputField from "./custom-input-field";
import useTranslation from "@configs/i18n/useTranslation";

export default function ObservationCustomFieldForm({ fields, form }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Heading mb={4} size="lg">
        📜 {t("OBSERVATION.CUSTOM_FIELDS")}
      </Heading>

      {fields.map(({ label, isRequired, fieldType, dataType, options }, index) => (
        <CustomInputField
          form={form}
          label={label}
          isRequired={isRequired}
          fieldType={fieldType}
          dataType={dataType}
          options={options}
          name={`customFields.${index}.value`}
        />
      ))}

      <Divider mb={3} />
    </Box>
  );
}
