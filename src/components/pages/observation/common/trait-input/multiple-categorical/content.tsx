import { Box, Flex, Image, Text, useCheckbox } from "@chakra-ui/react";
import { getTraitIcon } from "@utils/media";
import React from "react";

export default function TraitContent(props) {
  const { getHiddenInputProps, getControlProps } = useCheckbox(props);

  return (
    <Box as="label">
      <input {...getHiddenInputProps()} required={false} />
      <Flex
        {...getControlProps()}
        alignItems="center"
        p={2}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        bg="white"
        w="200px"
        _checked={{
          borderColor: "blue.500",
          bg: "blue.50"
        }}
        _focus={{
          boxShadow: "outline"
        }}
      >
        {props.icon && (
          <Image
            boxSize="2rem"
            mr={2}
            objectFit="contain"
            src={getTraitIcon(props.icon)}
            alt={props.value}
          />
        )}
        <Text>{props.label}</Text>
      </Flex>
    </Box>
  );
}
