import { Box, Button } from "@chakra-ui/react";
import React from "react";

interface TagProps {
  text: string;
  remove: any;
}

export default function Tag({ text, remove }: TagProps) {
  const handleOnRemove = (e) => {
    e.stopPropagation();
    remove(text);
  };

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="md"
      pl={2}
      bg="gray.300"
    >
      <span>{text}</span>
      <Button
        size="xs"
        type="button"
        variant="link"
        colorScheme="red"
        onClick={handleOnRemove}
        aria-label={`remove ${text}`}
      >
        &#10005;
      </Button>
    </Box>
  );
}
