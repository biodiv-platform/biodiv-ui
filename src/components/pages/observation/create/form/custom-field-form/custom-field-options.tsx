import { Image, Stack, Text } from "@chakra-ui/react";
import { getLocalIcon, getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React, { useMemo } from "react";
import { components } from "react-select";

export default function CustomFieldOption(props: any) {
  const imageURL = useMemo(
    () =>
      props?.data?.iconURL
        ? getResourceThumbnail(RESOURCE_CTX.USERGROUPS, props?.data?.iconURL, 32)
        : getLocalIcon(""),
    [props.data.iconURL]
  );
  return (
    <components.Option {...props}>
      <Stack isInline={true} alignItems="center">
        <Image boxSize="2rem" src={imageURL} />
        <Text color="gray.600">{props.data.label}</Text>
      </Stack>
    </components.Option>
  );
}
