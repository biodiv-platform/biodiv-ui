import { Box } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { NakshaLayerUpload } from "@ibp/naksha-upload";
import { ENDPOINT } from "@static/constants";
import { getTokens } from "@utils/auth";
import React from "react";

export default function MapCreatePageComponent() {
  const { accessToken } = getTokens();
  const router = useLocalRouter();

  const handleOnLayerUpload = (status) => {
    if (status) {
      router.push("/map", true);
    }
  };

  return (
    <Box h="calc(100vh - var(--heading-height))" overflowX="auto" position="relative" p={4}>
      <NakshaLayerUpload
        nakshaEndpoint={`${ENDPOINT.NAKSHA}/layer/upload`}
        callback={handleOnLayerUpload}
        bearerToken={`Bearer ${accessToken}`}
      />
    </Box>
  );
}
