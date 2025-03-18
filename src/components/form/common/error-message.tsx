import { Field } from "@chakra-ui/react";
import { getByPath } from "@utils/basic";
import React from "react";

export default function ErrorMessage({ errors, name }) {
  const errorText = getByPath(errors, `${name}.message`);
  return <Field.ErrorText>{errorText}</Field.ErrorText>;
}

export const ErrorMessageMulti = ({ errors, name }) => (
  <Field.ErrorText>
    {Array.isArray(errors[name])
      ? errors[name].map((e) => e && e?.status?.message)
      : errors[name]?.message}
  </Field.ErrorText>
);
