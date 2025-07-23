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
        cursor="pointer"
        _focus={{
          boxShadow: "outline"
        }}
        alignItems="center"
        border="2px"
        borderColor="gray.200"
        borderRadius="md"
        borderStyle="solid"
        lineHeight={1}
        p={2}
        h="3.25rem"
        _checked={{
          borderColor: "blue.500",
          bg: "blue.50"
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
