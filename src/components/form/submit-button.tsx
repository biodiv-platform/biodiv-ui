import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "../ui/button";

interface ISubmitButtonProps {
  children;
  leftIcon?;
  rightIcon?;
  isDisabled?;
  colorPalette?;
  mb?;
  w?;
  mt?;
  icon?;
}

export const SubmitButton = ({
  children,
  isDisabled,
  colorPalette = "blue",
  mb = 0,
  icon,
  leftIcon,
  rightIcon,
  ...rest
}: ISubmitButtonProps) => {
  const { formState } = useFormContext();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(isDisabled);
  }, [isDisabled]);

  return (
    <Button
      loading={formState.isSubmitting}
      type="submit"
      disabled={disabled}
      mb={mb}
      {...rest}
      colorPalette={colorPalette}
      variant={"solid"}
    >
      {leftIcon}
      {icon}
      {children}
      {rightIcon}
    </Button>
  );
};
