import { Box, Button, FormLabel, HStack } from "@chakra-ui/react";
import TextBoxField from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import React from "react";
import { useFieldArray } from "react-hook-form";

export default function ReferencesField({ name, label, form }) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name
  });

  return (
    <Box mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {fields.map((reference, index) => (
        <div key={reference.id}>
          <TextBoxField name={`${name}.[${index}].id`} hidden={true} label="id" form={form} />
          <HStack spacing={4} mb={4}>
            <TextBoxField
              name={`${name}.[${index}].title`}
              showLabel={false}
              label="Title"
              form={form}
              mb={0}
            />
            <TextBoxField
              name={`${name}.[${index}].url`}
              showLabel={false}
              label="URL"
              form={form}
              mb={0}
            />
            <Button
              variant="outline"
              colorScheme="red"
              minW="7rem"
              onClick={() => remove(index)}
              leftIcon={<DeleteIcon />}
            >
              {t("DELETE")}
            </Button>
          </HStack>
        </div>
      ))}
      <Button
        variant="outline"
        colorScheme="green"
        leftIcon={<AddIcon />}
        type="button"
        onClick={() => append({ title: "", url: "" })}
      >
        {t("SPECIES.ADD_REFERENCE")}
      </Button>
    </Box>
  );
}
