import { Flex, FlexProps, Separator, Text } from "@chakra-ui/react";
import React from "react";

interface IBoxHeadingProps {
  children;
  border?: boolean;
  subTitle?;
  p?;
  fontSize?;
  onClick?;
  styles?: FlexProps;
}

export default function BoxHeading({
  border = true,
  children,
  subTitle,
  p = 4,
  fontSize = "lg",
  onClick,
  styles
}: IBoxHeadingProps) {
  return (
    <>
      <Flex
        fontSize={fontSize}
        px={p}
        minH="3rem"
        fontWeight="bold"
        align="center"
        onClick={onClick}
        {...styles}
      >
        {children}
        {subTitle && (
          <Text as="span" fontSize="sm" color="gray.700" ml={2}>
            {subTitle}
          </Text>
        )}
      </Flex>
      {border && <Separator />}
    </>
  );
}
