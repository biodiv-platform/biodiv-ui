import { Badge, Box, Button, Flex, Radio, RadioGroup, SimpleGrid } from "@chakra-ui/core";
import ControlledText from "@components/form/text-controlled";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

import ImageUploaderField from "../image-uploader-field";

export default function Fields({ form, name, radioGroupName, disabled }) {
  const [value, setValue] = useState(form.control.defaultValuesRef.current[radioGroupName] || "0");
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
      <RadioGroup
        onChange={(e) => setValue(e.target.value)}
        name={radioGroupName}
        value={value}
        w="full"
        mb={4}
      >
        {fields.map((item, index) => (
          <Radio value={index.toString()} w="full" size="lg" mb={4}>
            <SimpleGrid columns={{ base: 1, md: 5 }} spacingX={4} ml={4}>
              <Box gridColumn="1/4">
                <SimpleGrid columns={2} spacingX={4}>
                  <ControlledText
                    isRequired={true}
                    disabled={disabled}
                    name={`values.${index}.value`}
                    label="Value"
                    form={form}
                  />
                  <ControlledText
                    name={`values.${index}.notes`}
                    disabled={disabled}
                    label="Notes"
                    form={form}
                  />
                </SimpleGrid>
                <Button
                  variantColor="red"
                  variant="outline"
                  leftIcon="delete"
                  isDisabled={fields.length < 3}
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </Box>
              <ImageUploaderField
                nestedPath="customField,values"
                simpleUpload={true}
                label="Icon"
                name={`values.${index}.iconURL`}
                form={form}
                mb={0}
              />
              <Flex alignItems="center">
                <Badge hidden={index.toString() !== value} variantColor="green">
                  Default
                </Badge>
              </Flex>
            </SimpleGrid>
          </Radio>
        ))}
      </RadioGroup>

      <Button
        variant="outline"
        onClick={() => append({ value: "append" })}
        variantColor="blue"
        leftIcon="add"
        isDisabled={disabled}
        mr={4}
        mb={4}
      >
        Add Option
      </Button>
    </>
  );
}
