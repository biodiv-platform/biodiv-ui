import { Box, Flex, Image, SimpleGrid, useCheckbox, useCheckboxGroup } from "@chakra-ui/react";
import { getGroupImageThumb } from "@utils/media";
import React from "react";

interface ITraitInputProps {
  type?: string;
  options: any[];
  gridColumns?;
  onBlur?;
  onChange;
  defaultValue?;
  isDatatableUsergroups?;
}

const CustomCheckBox = (props: any) => {
  const { getHiddenInputProps, getControlProps } = useCheckbox(props);

  return (
    <label>
      <input {...getHiddenInputProps()} required={false} />
      <Box
        {...getControlProps()}
        p={2}
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

const CheckBoxItems = ({
  options,
  onChange,
  defaultValue,
  gridColumns = [1, 1, 3, 5]
}: ITraitInputProps) => {
  const { getItemProps } = useCheckboxGroup({
    defaultValue: defaultValue && defaultValue.map((o) => o.toString()),
    onValueChange: (v) => onChange(v.map((i) => Number(i)))
  });

  return (
    <SimpleGrid columns={gridColumns} gridGap={4}>
      {options.map((o) => {
        return (
          <CustomCheckBox key={o.id} {...getItemProps({ value: String(o.id) })}>
            <Flex alignItems="center" h="2rem" overflow="hidden" title={o.name}>
              <Image
                loading="lazy"
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
