import { Box, Button, FormLabel, HStack } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";

export default function CommonReferencesField({ name, label, isCommonRefEdit }) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ name });

  // Add an empty reference when the component mounts if there are no fields
  useEffect(() => {
    if (fields.length === 0) {
      append({ title: "", url: "" });
    }
  }, []);

  return (
    <Box mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {fields.map((reference, index) => (
        <div data-key={reference.id} key={index}>
          <TextBoxField name={`${name}.${index}.id`} hidden={true} label="id" />
          <HStack spacing={4} mb={4}>
            <TextBoxField name={`${name}.${index}.title`} showLabel={false} label="Title" mb={0} />
            <TextBoxField name={`${name}.${index}.url`} showLabel={false} label="URL" mb={0} />

            {isCommonRefEdit && fields.length > 1 && (
              <Button
                variant="outline"
                colorScheme="red"
                minW="7rem"
                onClick={() => remove(index)}
                leftIcon={<DeleteIcon />}
              >
                {t("common:delete")}
              </Button>
            )}
          </HStack>
        </div>
      ))}

      {isCommonRefEdit && (
        <Button
          variant="outline"
          colorScheme="green"
          leftIcon={<AddIcon />}
          type="button"
          onClick={() => append({ title: "", url: "" })}
        >
          {t("species:add_reference")}
        </Button>
      )}
    </Box>
  );
}
