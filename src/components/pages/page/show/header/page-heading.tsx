import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

interface PageHeadingProps {
  children;
  description?;
}

export const PageHeading = ({ children, description }: PageHeadingProps) => (
  <Box position="absolute" top={0} left={0} bottom={0} right={0}>
    <Flex className="container" boxSize="full" alignItems="center">
      <div>
        <Heading as="h1" size="2xl" mb={2} fontWeight="bolder">
          {children}
        </Heading>
        {description && (
          <Text fontSize="xl" fontWeight="semibold">
            {description}
          </Text>
        )}
      </div>
    </Flex>
  </Box>
);
