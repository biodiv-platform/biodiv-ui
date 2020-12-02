import { Badge, Box, Button, Flex, Radio, RadioGroup, SimpleGrid, HStack } from "@chakra-ui/react";
import TextBox from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

import ImageUploaderField from "../image-uploader-field";

export default function Fields({ form, name, radioGroupName, disabled }) {
  const [value, setValue] = useState(form.control.defaultValuesRef.current[radioGroupName] || "0");
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name
  });

  useEffect(() => {
    form.setValue(radioGroupName, value);
  }, [value]);

  useEffect(() => {
    form.register(radioGroupName);
    form.setValue(radioGroupName, value);
  }, [form.register]);

  return (
    <>
      <RadioGroup onChange={setValue} name={radioGroupName} value={value} w="full" mb={4}>
        {fields.map((_item, index) => (
          <HStack key={_item.id} mb={4}>
            <Radio value={index.toString()} size="lg" />
            <SimpleGrid columns={{ base: 1, md: 5 }} spacingX={4} ml={4}>
              <Box gridColumn="1/4">
                <SimpleGrid columns={2} spacingX={4}>
                  <TextBox
                    isRequired={true}
                    disabled={disabled}
                    name={`values.${index}.value`}
                    label={t("GROUP.CUSTOM_FIELD.VALUE")}
                    form={form}
                  />
                  <TextBox
                    name={`values.${index}.notes`}
                    disabled={disabled}
                    label="Notes"
                    form={form}
                  />
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
                form={form}
                mb={0}
              />
              <Flex alignItems="center">
                <Badge hidden={index.toString() !== value} colorScheme="green">
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
