import { Box, Flex, Image, SimpleGrid, useCheckbox, useCheckboxGroup } from "@chakra-ui/core";
import { getGroupImageThumb } from "@utils/media";
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
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  return (
    <label>
      <input {...getInputProps()} />
      <Box
        {...getCheckboxProps()}
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
      >
        {props.children}
      </Box>
    </label>
  );
};

const CheckBoxItems = ({
  options,
  onChange,
  defaultValue,
  gridColumns = [1, 1, 3, 5]
}: ITraitInputProps) => {
  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue: defaultValue && defaultValue.map((o) => o.toString()),
    onChange: (v) => onChange(v.map((i) => Number(i)))
  });

  return (
    <SimpleGrid columns={gridColumns} gridGap={4}>
      {options.map((o) => {
        return (
          <CustomCheckBox key={o.id} {...getCheckboxProps({ value: String(o.id) })}>
            <Flex alignItems="center" h="2rem" overflow="hidden" title={o.name}>
              <Image
                loading="lazy"
                ignoreFallback={true}
                boxSize="2rem"
                mr={2}
                objectFit="contain"
                src={o.id === "null" ? o.icon : getGroupImageThumb(o.icon)}
                alt={o.name}
              />
              <Box lineHeight="1rem" className="elipsis-2">
                {o.name}
              </Box>
            </Flex>
          </CustomCheckBox>
        );
      })}
    </SimpleGrid>
  );
};

export default CheckBoxItems;
