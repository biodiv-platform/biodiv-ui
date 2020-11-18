import { Stack, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import React from "react";

export default function WKTList({ list, onDelete, nameTitle }) {
  return list.length > 0 ? (
    <Stack spacing={2} p={4} pt={0} isInline={true}>
      {list.map((o, index) => (
        <Tag key={index} rounded="full" variant="solid" colorScheme="blue">
          <TagLabel>{o[nameTitle]}</TagLabel>
          <TagCloseButton onClick={() => onDelete(index)} />
        </Tag>
      ))}
    </Stack>
  ) : null;
}
