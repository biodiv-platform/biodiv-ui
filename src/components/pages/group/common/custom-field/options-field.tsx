import { Badge, Box, Button, Flex, HStack, Radio, RadioGroup, SimpleGrid } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import React from "react";
import { useController, useFieldArray } from "react-hook-form";

import ImageUploaderField from "../image-uploader-field";

export default function Fields({ name, radioGroupName, disabled }) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ name });
  const radioGroupController = useController({ name: radioGroupName });

  return (
    <>
      <RadioGroup
        onChange={radioGroupController.field.onChange}
        name={radioGroupName}
        value={radioGroupController.field.value}
        w="full"
        mb={4}
      >
        {fields.map((_item, index) => (
          <HStack key={_item.id} mb={4}>
            <Radio value={index.toString()} size="lg" />
            <SimpleGrid columns={{ base: 1, md: 5 }} spacingX={4} ml={4}>
              <Box gridColumn="1/4">
                <SimpleGrid columns={2} spacingX={4}>
                  <TextBoxField
                    isRequired={true}
                    disabled={disabled}
                    name={`values.${index}.value`}
                    label={t("GROUP.CUSTOM_FIELD.VALUE")}
                  />
                  <TextBoxField name={`values.${index}.notes`} disabled={disabled} label="Notes" />
                </SimpleGrid>
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<DeleteIcon />}
                  isDisabled={fields.length < 3}
                  onClick={() => remove(index)}
                >
                  {t("GROUP.CUSTOM_FIELD.REMOVE.TITLE")}
                </Button>
              </Box>
              <ImageUploaderField
                nestedPath="customField,values"
                simpleUpload={true}
                label={t("GROUP.CUSTOM_FIELD.ICON")}
                name={`values.${index}.iconURL`}
                mb={0}
              />
              <Flex alignItems="center">
                <Badge
                  hidden={index.toString() !== radioGroupController.field.value}
                  colorScheme="green"
                >
                  {t("GROUP.CUSTOM_FIELD.DEFAULT")}
                </Badge>
              </Flex>
            </SimpleGrid>
          </HStack>
        ))}
      </RadioGroup>

      <Button
        variant="outline"
        onClick={() => append({ value: "", notes: "" })}
        colorScheme="blue"
        leftIcon={<AddIcon />}
        isDisabled={disabled}
        mr={4}
        mb={4}
      >
        {t("GROUP.CUSTOM_FIELD.ADD.OPTIONS")}
      </Button>
    </>
  );
}
