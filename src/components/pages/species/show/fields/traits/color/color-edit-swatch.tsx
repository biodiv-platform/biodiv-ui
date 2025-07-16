import { Flex, IconButton } from "@chakra-ui/react";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import React from "react";
import { RgbStringColorPicker } from "react-colorful";

import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger
} from "@/components/ui/popover";

export function ColorEditSwatch({ color, onChange, onDelete, index }) {
  return (
    <Flex
      border="1px"
      borderColor="gray.300"
      borderRadius="md"
      lineHeight={1}
      h="3.25rem"
      alignItems="center"
      justifyContent="flex-end"
      bg={color}
      overflow="hidden"
    >
      <PopoverRoot lazyMount={true}>
        <PopoverTrigger>
          <IconButton h="full" borderRadius={0} aria-label="Edit">
            <EditIcon />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent maxW="14rem">
          <PopoverArrow />
          <PopoverBody>
            <RgbStringColorPicker color={color} onChange={(v) => onChange(index, v)} />
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
      <IconButton
        h="full"
        borderRadius={0}
        onClick={() => onDelete(index)}
        colorPalette="red"
        aria-label="Delete"
      >
        <DeleteIcon />
      </IconButton>
    </Flex>
  );
}
