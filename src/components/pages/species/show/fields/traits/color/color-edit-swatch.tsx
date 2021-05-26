import {
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger
} from "@chakra-ui/react";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import React from "react";
import { RgbStringColorPicker } from "react-colorful";

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
      <Popover isLazy={true}>
        <PopoverTrigger>
          <IconButton h="full" borderRadius={0} aria-label="Edit" icon={<EditIcon />} />
        </PopoverTrigger>
        <PopoverContent maxW="14rem">
          <PopoverArrow />
          <PopoverBody>
            <RgbStringColorPicker color={color} onChange={(v) => onChange(index, v)} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <IconButton
        h="full"
        borderRadius={0}
        onClick={() => onDelete(index)}
        colorScheme="red"
        aria-label="Delete"
        icon={<DeleteIcon />}
      />
    </Flex>
  );
}
