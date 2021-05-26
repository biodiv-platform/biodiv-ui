import { Box, Divider, Text, VisuallyHidden } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import useTranslation from "@hooks/use-translation";
import React from "react";
import { useFormContext } from "react-hook-form";

import CustomFieldLastValue from "./custom-field-last-value";
import CustomInputField from "./custom-input-field";

export default function ObservationCustomFieldForm({ fields }) {
  const { setValue } = useFormContext();
  const { t } = useTranslation();

  return (
    <Box>
      <Text mb={2} fontSize="2xl" fontWeight="bold">
        📜 {t("OBSERVATION.CUSTOM_FIELDS")}
      </Text>

      {fields.map(({ label, isRequired, fieldType, dataType, options, customFieldId }, index) => {
        const fieldName = `customFields.${index}.value`;

        return (
          <Box mb={4} key={index}>
            <CustomInputField
              label={label}
              isRequired={isRequired}
              fieldType={fieldType}
              dataType={dataType}
              options={options}
              name={fieldName}
            />
            <CustomFieldLastValue id={customFieldId} name={fieldName} set={setValue} />
            <VisuallyHidden>
              <CheckboxField name={`customFields.${index}.isRequired`} label={label} />
            </VisuallyHidden>
          </Box>
        );
      })}

      <Divider mb={3} />
    </Box>
  );
}
