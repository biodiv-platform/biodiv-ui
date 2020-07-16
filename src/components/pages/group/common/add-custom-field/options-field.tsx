import { Badge, Box, Button, IconButton, Radio, RadioGroup } from "@chakra-ui/core";
import TextField from "@components/form/text";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

import ImageUploaderField from "../image-uploader-field";

export default function Fields({ form, name, radioGroupName }) {
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
        onChange={(e) => setValue(`${e.target.value}`)}
        name={radioGroupName}
        value={value}
      >
        {fields.map((item, index) => {
          return (
            <Radio mb={4} value={`${index}`}>
              <Box
                key={item.id}
                display={[null, "flex"]}
                width={["100%", 500, 850]}
                justifyContent="space-evenly"
                role="radio"
                alignItems="center"
              >
                <TextField
                  isRequired={true}
                  name={`values[${index}].value`}
                  label="Value"
                  form={form}
                />
                <TextField name={`values[${index}].notes`} label="notes" form={form} />
                <ImageUploaderField
                  nestedPath="customField,values"
                  simpleUpload={true}
                  label="icon"
                  name={`values[${index}].iconURL`}
                  form={form}
                />
                {fields.length > 2 && (
                  <IconButton
                    variantColor="red"
                    aria-label="delete-options"
                    variant="outline"
                    icon="delete"
                    onClick={() => remove(index)}
                  />
                )}
              </Box>
              {`${index}` === value && <Badge variantColor="green">Default</Badge>}
            </Radio>
          );
        })}
      </RadioGroup>

      <Button
        variant="outline"
        onClick={() => {
          append({ value: "append" });
        }}
        variantColor="blue"
        leftIcon="add"
      >
        Add Options
      </Button>
    </>
  );
}
