import TextBoxField from "@components/form/text";
import { Box } from "@chakra-ui/core";
import React from "react";

export default function ImageMetaForm({ form, imagePicker }) {
  const formComponent = (
    <>
      <TextBoxField name="title" isRequired={true} form={form} label="Title" />
      <TextBoxField name="moreLinks" form={form} label="Link" />
      <TextBoxField name="authorId" isRequired={true} type="number" form={form} label="Author Id" />
      {!imagePicker && <TextBoxField name="fileName" form={form} label="Observation Image" />}
    </>
  );
  return imagePicker ? <Box gridColumn="1/4">{formComponent}</Box> : formComponent;
}
