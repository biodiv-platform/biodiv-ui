import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { FormContextValues } from "react-hook-form";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface IRichTextareaProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  form: FormContextValues<any>;
}

const RichTextareaField = ({ name, label, hint, form, mb = 4, ...props }: IRichTextareaProps) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "link"],
      [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
      ["clean"]
    ]
  };

  const [quillValue, setQuillValue] = useState(form.control.defaultValuesRef.current[name]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  useEffect(() => {
    form.setValue(name, quillValue);
  }, [quillValue]);

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/quill@1.3.7/dist/quill.snow.css"
        />
      </Head>
      {label && <FormLabel>{label}</FormLabel>}
      <Box borderRadius="md" className="ql-box">
        <ReactQuill defaultValue={quillValue} onChange={setQuillValue} modules={modules} />
      </Box>
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default RichTextareaField;
