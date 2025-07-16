import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import React from "react";

export default function UnsubscribeScreen({ onClick, icon, title, description, buttonText }) {
  return (
    <Flex h="100vh" w="100%" alignItems="center" justifyContent="center">
      <Box p={4} textAlign="center" position="relative">
        <Image className="floating" display="inline" w="84px" src={icon} mb={2} />
        <Heading mb={2} size="lg">
          {title}
        </Heading>
        <Text mb={6} color="gray.600" fontSize="xl">
          {description}
        </Text>
        <Button shadow="md" colorPalette="blue" onClick={onClick}>
          {buttonText}
        </Button>
      </Box>
    </Flex>
  );
}
