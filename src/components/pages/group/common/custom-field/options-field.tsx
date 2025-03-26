import { Badge, Button, Flex, GridItem, HStack, SimpleGrid } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useController, useFieldArray } from "react-hook-form";

import { Radio, RadioGroup } from "@/components/ui/radio";

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
            {/* size="lg"  */}
            <Radio value={index.toString()} />
            <SimpleGrid columns={{ base: 1, md: 5 }} gapX={4} ml={4}>
              <GridItem colSpan={3}>
                <SimpleGrid columns={2} gapX={4}>
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
                  colorPalette="red"
                  variant="outline"
                  disabled={fields.length < 3 || disabled}
                  onClick={() => remove(index)}
                >
                  <DeleteIcon />
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
                  colorPalette="green"
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
        colorPalette="blue"
        disabled={disabled}
        mr={4}
        mb={4}
      >
        <AddIcon />
        {t("group:custom_field.add.options")}
      </Button>
    </>
  );
}
