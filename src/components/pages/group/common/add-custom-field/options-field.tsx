import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { RadioGroup, Box, Button, IconButton, Radio } from "@chakra-ui/core";
import TextField from "@components/form/text";

export default function Fields({ form }) {
  const [value, setValue] = useState("1");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "optionalObject"
  });

  return (
    <>
      <RadioGroup
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
      >
        {fields.map((item, index) => {
          return (
            <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
              <TextField
                isRequired={true}
                name={`optionalObject[${index}].value`}
                label="Value"
                form={form}
              />
              <TextField name={`optionalObject[${index}].notes`} label="notes" form={form} />
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
