import React, { useMemo } from "react";
import { components } from "react-select";
import { Stack, Image, Text } from "@chakra-ui/core";
import { getGroupImageThumb } from "@utils/media";

export default function CustomFieldOption(props) {
  const imageURL = useMemo(() => getGroupImageThumb(props.data.iconURL), [props.data.iconURL]);
  return (
    <components.Option {...props}>
      <Stack isInline={true} alignItems="center">
        <Image size="2rem" src={imageURL} />
        <Text color="gray.600">{props.data.label}</Text>
      </Stack>
    </components.Option>
  );
}