import { Button } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

interface ISubmitButtonProps {
  children;
  leftIcon?;
  rightIcon?;
  isDisabled?;
  variantColor?;
  mb?;
  w?;
  mt?;
  form: UseFormMethods<Record<string, any>>;
}

const SubmitButton = ({
  children,
  isDisabled,
  form,
  variantColor = "blue",
  mb = 0,
  ...rest
}: ISubmitButtonProps) => {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(isDisabled);
  }, [isDisabled]);

  return (
    <Button
      variantColor={variantColor}
      isLoading={form.formState.isSubmitting}
      type="submit"
      isDisabled={disabled}
      mb={mb}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
