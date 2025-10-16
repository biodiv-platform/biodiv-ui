import { Box } from "@chakra-ui/react";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React from "react";

import { mapStyles } from "@/static/constants";

const NakshaMaplibreView: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreView),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

interface GeoJSONPreviewProps {
  data: any;
  h?;
  zoom?;
  viewPort?;
  mb?: number;
  maxZoom?: number;
}

export default function GeoJSONPreview({
  data,
  h = "22rem",
  zoom,
  maxZoom,
  mb
}: GeoJSONPreviewProps) {
  const defaultViewState = React.useMemo(() => getMapCenter(zoom || 2.8, { maxZoom }), []);

  return (
    <Box position="relative" h={h} overflow="hidden" mb={mb} borderRadius="md">
      <NakshaMaplibreView defaultViewState={defaultViewState} data={data} mapStyles={mapStyles} />
    </Box>
  );
}
