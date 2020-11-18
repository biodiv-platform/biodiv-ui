import { Flex, Text } from "@chakra-ui/core";
import React from "react";

interface IBoxHeadingProps {
  children;
  border?: boolean;
  subTitle?;
  p?;
  fontSize?;
}

export default function BoxHeading({
  border = true,
  children,
  subTitle,
  p = 4,
  fontSize = "lg"
}: IBoxHeadingProps) {
  return (
    <Flex
      borderBottom={border ? "1px" : 0}
      borderColor="gray.300"
      fontSize={fontSize}
      px={p}
      minH="3rem"
      fontWeight="bold"
      align="center"
    >
      {children}
      {subTitle && (
        <Text as="span" fontSize="sm" color="gray.700" ml={2}>
          {subTitle}
        </Text>
      )}
    </Flex>
  );
}
