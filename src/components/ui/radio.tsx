import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react";
import * as React from "react";

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  rootRef?: React.Ref<HTMLDivElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  const { children, inputProps, rootRef, disabled, ...rest } = props;
  return (
    <ChakraRadioGroup.Item ref={rootRef} data-disabled={disabled ? "" : undefined} {...rest}>
      <ChakraRadioGroup.ItemHiddenInput ref={ref} disabled={disabled} {...inputProps} />
      <ChakraRadioGroup.ItemIndicator />
      {children && <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>}
    </ChakraRadioGroup.Item>
  );
});

export const RadioGroup = ChakraRadioGroup.Root;
