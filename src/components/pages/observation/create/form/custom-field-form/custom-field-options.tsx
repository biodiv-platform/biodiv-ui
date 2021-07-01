import { Image, Stack, Text } from "@chakra-ui/react";
import { getGroupImageThumb } from "@utils/media";
import React, { useMemo } from "react";
import { components } from "react-select";

export default function CustomFieldOption(props) {
  const imageURL = useMemo(() => getGroupImageThumb(props.data.iconURL), [props.data.iconURL]);
  return (
    <components.Option {...props}>
      <Stack isInline={true} alignItems="center">
        <Image boxSize="2rem" src={imageURL} />
        <Text color="gray.600">{props.data.label}</Text>
      </Stack>
    </components.Option>
  );
}
