import {
  Badge,
  Button,
  Flex,
  GridItem,
  HStack,
  Radio,
  RadioGroup,
  SimpleGrid
} from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useController, useFieldArray } from "react-hook-form";

import ImageUploaderField from "../image-uploader-field";

export default function Fields({ name, radioGroupName, disabled, isEdit }) {
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
              <GridItem colSpan={3}>
                <SimpleGrid columns={2} spacingX={4}>
                  {isEdit ? (
                    <TextBoxField
                      isRequired={true}
                      disabled={disabled}
                      name={`values.${index}.values`}
                      label={t("group:custom_field.value")}
                    />
                  ) : (
                    <TextBoxField
                      isRequired={true}
                      disabled={disabled}
                      name={`values.${index}.value`}
                      label={t("group:custom_field.value")}
                    />
                  )}
                  <TextBoxField name={`values.${index}.notes`} disabled={disabled} label="Notes" />
                </SimpleGrid>
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<DeleteIcon />}
                  isDisabled={fields.length < 3 || disabled}
                  onClick={() => remove(index)}
                >
                  {t("group:custom_field.remove.title")}
                </Button>
              </GridItem>
              <ImageUploaderField
                nestedPath="customField,values"
                simpleUpload={true}
                label={t("group:custom_field.icon")}
                name={`values.${index}.iconURL`}
                mb={0}
                disabled={disabled}
              />
              <Flex alignItems="center">
                <Badge
                  hidden={index.toString() !== radioGroupController.field.value}
                  colorScheme="green"
                >
                  {t("group:custom_field.default")}
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
        {t("group:custom_field.add.options")}
      </Button>
    </>
  );
}
