import { Button } from "@chakra-ui/react";
import React from "react";
import { useFormContext } from "react-hook-form";

interface ISubmitButtonProps {
  children;
  leftIcon?;
  rightIcon?;
  isDisabled?;
  colorScheme?;
  mb?;
  w?;
  mt?;
  mr?;
}

export const SubmitButton = ({
  children,
  isDisabled,
  colorScheme = "blue",
  mb = 0,
  ...rest
}: ISubmitButtonProps) => {
  const { formState } = useFormContext();

  return (
    <Button
      colorScheme={colorScheme}
      isLoading={formState.isSubmitting}
      type="submit"
      isDisabled={isDisabled}
      mb={mb}
      {...rest}
    >
      {children}
    </Button>
  );
};
