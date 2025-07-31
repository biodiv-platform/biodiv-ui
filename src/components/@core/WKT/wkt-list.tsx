import { Stack, Tag } from "@chakra-ui/react";
import React from "react";

export default function WKTList({ list, onDelete, nameTitle }) {
  return list.length > 0 ? (
    <Stack gap={2} p={4} pt={0} direction="row">
      {list.map((o, index) => (
        <Tag.Root variant="solid" colorPalette="blue" key={index} rounded="full">
          <Tag.StartElement />
          <Tag.Label>{o[nameTitle]}</Tag.Label>
          <Tag.EndElement>
            <Tag.CloseTrigger onClick={() => onDelete(index)} />
          </Tag.EndElement>
        </Tag.Root>
      ))}
    </Stack>
  ) : null;
}
