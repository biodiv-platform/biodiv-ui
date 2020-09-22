import React from "react";
import { Box, Divider, Heading, VisuallyHidden } from "@chakra-ui/core";

import CustomInputField from "./custom-input-field";
import useTranslation from "@hooks/use-translation";
import CheckboxField from "@components/form/checkbox";

export default function ObservationCustomFieldForm({ fields, form }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Heading mb={4} size="lg">
        📜 {t("OBSERVATION.CUSTOM_FIELDS")}
      </Heading>

      {fields.map(({ label, isRequired, fieldType, dataType, options }, index) => (
        <>
          <CustomInputField
            form={form}
            label={label}
            isRequired={isRequired}
            fieldType={fieldType}
            dataType={dataType}
            options={options}
            name={`customFields.${index}.value`}
          />
          <VisuallyHidden>
            <CheckboxField form={form} name={`customFields.${index}.isRequired`} label={label} />
          </VisuallyHidden>
        </>
      ))}

      <Divider mb={3} />
    </Box>
  );
}
