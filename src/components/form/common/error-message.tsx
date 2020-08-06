import { FormErrorMessage } from "@chakra-ui/core";
import { getByPath } from "@utils/basic";
import React from "react";

export default function ErrorMessage({ errors, name }) {
  const errorText = getByPath(errors, `${name}.message`);
  return <FormErrorMessage>{errorText}</FormErrorMessage>;
}
