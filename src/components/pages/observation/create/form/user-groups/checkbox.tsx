import { Box, Flex, Image, VisuallyHidden } from "@chakra-ui/core";
import { getGroupImageThumb } from "@utils/media";
import React from "react";

const Checkbox = ({ value, label, icon, ...props }) => (
  <label role="checkbox" className="custom-checkbox" aria-checked={props.isChecked}>
    {/* @ts-ignore */}
    <VisuallyHidden as="input" type="checkbox" {...props} value={value} />
    <Flex alignItems="center" h="2rem" overflow="hidden" title={label}>
      <Image
        loading="lazy"
        ignoreFallback={true}
        boxSize="2rem"
        mr={2}
        objectFit="contain"
        src={value === "null" ? icon : getGroupImageThumb(icon)}
        alt={label}
      />
      <Box lineHeight="1rem" className="elipsis-2">
        {label}
      </Box>
    </Flex>
  </label>
);

export default Checkbox;
