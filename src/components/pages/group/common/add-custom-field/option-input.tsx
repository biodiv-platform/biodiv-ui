import React from "react";
import { IconButton } from "@chakra-ui/core";
import ImageUploaderField from "../image-uploader-field";
import TextInput from "@components/form/text";

export default function CustomFieldOptionInput({ form, remove, index }) {
  return (
    <>
      <TextInput name={`optionalObject[${index}]value`} label="Value Name" form={form} />
      <TextInput name={`optionalObject[${index}]notes`} label="Value Name" form={form} />
      <ImageUploaderField label="icon" name={`optionalObject[${index}]iconUrl`} form={form} />
      <IconButton
        onClick={() => {
          remove(index);
        }}
        variant="outline"
        variantColor="red"
        icon="delete"
        size="sm"
        aria-label="delete-option"
      />
    </>
  );
}
