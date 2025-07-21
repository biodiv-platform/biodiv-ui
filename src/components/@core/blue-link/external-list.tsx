import { Stack } from "@chakra-ui/react";
import React, { useMemo } from "react";

import ExternalBlueLink from "./external";

export default function ExternalBlueLinkList({ website }: { website?: string }) {
  const websiteList = useMemo(
    () =>
      website?.split(",").map((url) => ({
        href: (url.includes("//") ? url : `//${url}`).trim(),
        children: url,
        key: url
      })),
    [website]
  );

  return (
    // isInline={false}
    <Stack>
      {websiteList?.map((props) => (
        <ExternalBlueLink {...props} />
      ))}
    </Stack>
  );
}
