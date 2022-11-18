import { Box } from "@chakra-ui/react";
import ClusterMap from "@components/pages/observation/show/sidebar/cluster-map";
import User from "@components/pages/observation/show/sidebar/user";
import SITE_CONFIG from "@configs/site-config";
import { UserIbp } from "@interfaces/observation";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React from "react";
import wkt from "wkt";

const defaultViewState = React.useMemo(() => getMapCenter(2.8), []);
const NakshaMapboxView: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxView),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);
interface ISidebarProps {
  datatable;
  authorInfo?: UserIbp;
  taxon?: number;
}

export default function Sidebar({ datatable, authorInfo, taxon }: ISidebarProps) {
  return (
    <Box mb={2}>
      <User user={authorInfo} />
      {datatable.geographicalCoverageTopology ? (
        <Box position="relative" h="35rem" bg="gray.200" borderRadius="md" overflow="hidden" mb={4}>
          <NakshaMapboxView
            defaultViewState={defaultViewState}
            data={wkt.parse(datatable.geographicalCoverageTopology)}
            mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          />
        </Box>
      ) : (
        <ClusterMap
          filter={taxon && { taxon }}
          latitude={datatable?.geographicalCoverageLatitude}
          longitude={datatable?.geographicalCoverageLongitude}
        />
      )}
    </Box>
  );
}
