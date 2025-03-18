import { Box, Button, FormLabel, HStack } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFieldArray } from "react-hook-form";

export default function ReferencesField({ name, label }) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ name });

  return (
    <Box mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {fields.map((reference, index) => (
        <div data-key={reference.id} key={index}>
          <TextBoxField name={`${name}.${index}.id`} hidden={true} label="id" />
          <HStack spacing={4} mb={4}>
            <TextBoxField name={`${name}.${index}.title`} showLabel={false} label="Title" mb={0} />
            <TextBoxField name={`${name}.${index}.url`} showLabel={false} label="URL" mb={0} />
            <Button
              variant="outline"
              colorPalette="red"
              minW="7rem"
              onClick={() => remove(index)}
              leftIcon={<DeleteIcon />}
            >
              {t("common:delete")}
            </Button>
          </HStack>
        </div>
      ))}
      <Button
        variant="outline"
        colorPalette="green"
        leftIcon={<AddIcon />}
        type="button"
        onClick={() => append({ title: "", url: "" })}
      >
        {t("species:add_reference")}
      </Button>
    </Box>
  );
}
