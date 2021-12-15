import { Box, Divider, Text, VisuallyHidden } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import useTranslation from "next-translate/useTranslation";
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
        📜 {t("observation:custom_fields")}
      </Text>

      {fields.map(({ label, notes, isRequired, fieldType, dataType, options, customFieldId }, index) => {
        const fieldName = `customFields.${index}.value`;

        return (
          <Box mb={4} key={index}>
            <CustomInputField
              label={label}
              isRequired={isRequired}
              fieldType={fieldType}
              dataType={dataType}
              options={options}
              hint={notes}
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
