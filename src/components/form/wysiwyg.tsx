import WYSIWYGEditor from "@components/@core/wysiwyg-editor";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "../ui/field";

interface IWYSIWYGFieldProps {
  name: string;
  label?: string;
  mt?: number;
  mb?: number;
  hint?: string;
  uploadHandler?;
  fileUploadHandler?;
}

const WYSIWYGField = ({
  name,
  label,
  mb = 4,
  hint,
  uploadHandler,
  fileUploadHandler,
  ...props
}: IWYSIWYGFieldProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <Field invalid={!!fieldState.error} mb={mb} {...props}>
      {label && <Field label={label} />}
      <WYSIWYGEditor
        name={name}
        value={field.value}
        onEditorChange={field.onChange}
        placeholder={label}
        onBlur={field.onBlur}
        uploadHandler={uploadHandler}
        fileUploadHandler={fileUploadHandler}
      >
        {label}
      </WYSIWYGEditor>

      <Field errorText={fieldState?.error?.message} />
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};

export default WYSIWYGField;
