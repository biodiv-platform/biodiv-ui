import { Box, Flex, Image, Text } from "@chakra-ui/core";
import { getTraitIcon } from "@utils/media";
import React from "react";

export default function TraitContent(props) {
  const { getInputProps, getCheckboxProps } = props.inputHook(props);

  const handleOnChange = (e) => {
    props.onChange(props.isChecked ? null : Number(e.target.value));
  };

  return (
    <Box as="label">
      <input {...getInputProps()} onChange={() => null} onClick={handleOnChange} />
      <Flex
        {...getCheckboxProps()}
        alignItems="center"
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
        <Image
          boxSize="2rem"
          mr={2}
          objectFit="contain"
          src={getTraitIcon(props.icon)}
          alt={props.value}
        />
        <Text>{props.label}</Text>
      </Flex>
    </Box>
  );
}
