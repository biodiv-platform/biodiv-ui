import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
}

export const SubmitButton = ({
  children,
  isDisabled,
  colorScheme = "blue",
  mb = 0,
  ...rest
}: ISubmitButtonProps) => {
  const { formState } = useFormContext();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(isDisabled);
  }, [isDisabled]);

  return (
    <Button
      colorScheme={colorScheme}
      isLoading={formState.isSubmitting}
      type="submit"
      isDisabled={disabled}
      mb={mb}
      {...rest}
    >
      {children}
    </Button>
  );
};
