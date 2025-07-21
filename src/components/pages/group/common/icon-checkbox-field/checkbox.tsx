import { Box, HStack, Image, useCheckbox, useCheckboxGroup } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import { getLocalIcon } from "@utils/media";
import React from "react";

interface ITraitInputProps {
  type?: string;
  options: any[];
  gridColumns?;
  onBlur?;
  onChange;
  defaultValue?;
}

const CustomCheckBox = (props: any) => {
  const { getHiddenInputProps, getControlProps } = useCheckbox(props);

  return (
    <label>
      <input {...getHiddenInputProps()} required={false} />
      <Box
        {...getControlProps()}
        p={1}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        bg="white"
        _checked={{
          borderColor: "blue.500",
          bg: "blue.50"
        }}
        _focus={{
          boxShadow: "outline"
        }}
        style={undefined}
      >
        {props.children}
      </Box>
    </label>
  );
};

const CheckBoxItems = ({ options, type, onChange, defaultValue }: ITraitInputProps) => {
  const { getItemProps } = useCheckboxGroup({
    defaultValue: defaultValue && defaultValue.map((o) => o.toString()),
    onValueChange: (v) => onChange(v.map((i) => Number(i)))
  });

  return (
    <HStack className="cb-items">
      {options.map((o) => {
        return (
          <CustomCheckBox key={o.id} {...getItemProps({ value: o.id.toString() })}>
            <Tooltip title={o.name} positioning={{ placement: "top" }} showArrow={true}>
              <Image
                boxSize="2.6rem"
                loading="lazy"
                src={getLocalIcon(o.name, type)}
                alt={o.name}
              />
            </Tooltip>
          </CustomCheckBox>
        );
      })}
    </HStack>
  );
};

export default CheckBoxItems;
