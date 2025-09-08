import { Box } from "@chakra-ui/react";
import ClusterMap from "@components/pages/observation/show/sidebar/cluster-map";
import User from "@components/pages/observation/show/sidebar/user";
import { UserIbp } from "@interfaces/observation";
import { defaultViewState, NakshaMaplibreView } from "naksha-components-react";
import React from "react";
import wkt from "wkt";

import { mapStyles } from "@/static/constants";

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
          <NakshaMaplibreView
            defaultViewState={defaultViewState}
            data={wkt.parse(datatable.geographicalCoverageTopology)}
            mapStyles={mapStyles}
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
