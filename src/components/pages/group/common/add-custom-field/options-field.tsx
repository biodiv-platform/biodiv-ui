import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { RadioGroup, Box, Button, IconButton, Radio } from "@chakra-ui/core";
import TextField from "@components/form/text";
import ImageUploaderField from "../image-uploader-field";

export default function Fields({ form, name }) {
  const [value, setValue] = useState("1");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name
  });

  return (
    <>
      <RadioGroup onChange={(e) => setValue(e.target.value)} value={value}>
        {fields.map((item, index) => {
          return (
            <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
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
                name="iconURL"
                form={form}
              />
              <Radio value={index}>Default</Radio>
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
